import {Component, OnInit} from '@angular/core';
import {PageBreadcrumbComponent} from '../../common/page-breadcrumb/page-breadcrumb.component';
import {ComponentCardComponent} from '../../common/component-card/component-card.component';
import {ApiError, ProductService} from '../../../services/product.service';
import {ProductDto} from '../../../dtos/product/product.dto';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AlertService} from '../../../services/alert.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    DatePipe,
    RouterLink
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: ProductDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  isDeletingId: number | null = null;

  constructor(
    private productService: ProductService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err: ApiError) => {
        this.errorMessage = err.message ?? 'Failed to load products.';
        this.isLoading = false;
        console.error('Products API error:', err);
      },
    });
  }

  async confirmDelete(id: number) {
    const result = await this.alert.confirm(
      'Delete product?',
      'This action cannot be undone.'
    );

    if (!result.isConfirmed) return;

    this.isDeletingId = id;

    try {
      await firstValueFrom(this.productService.delete(id));

      await this.alert.success('Deleted!', 'Product deleted successfully.');

      // Option A: remove from UI without reloading
      this.products = this.products.filter((p) => p.productId !== id);

      // Option B: reload from API (if you prefer)
      // this.loadProducts();
    } catch (err: any) {
      const apiErr = err as ApiError;

      if (apiErr?.status === 404) {
        await this.alert.error('Not found', 'This product is already removed.');
        // keep UI consistent
        this.products = this.products.filter((p) => p.productId !== id);
        return;
      }

      await this.alert.error('Delete failed', apiErr?.message ?? 'Failed to delete product.');
      console.error(err);
    } finally {
      this.isDeletingId = null;
    }
  }

  getBadgeColor(type: string): 'success' | 'warning' | 'error' {
    if (type === 'Complete') return 'success';
    if (type === 'Pending') return 'warning';
    return 'error';
  }
}
