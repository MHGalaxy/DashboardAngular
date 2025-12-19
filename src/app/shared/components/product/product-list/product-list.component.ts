import {Component, OnInit} from '@angular/core';
import {PageBreadcrumbComponent} from '../../common/page-breadcrumb/page-breadcrumb.component';
import {ComponentCardComponent} from '../../common/component-card/component-card.component';
import {ApiError, ProductService} from '../../../services/product.service';
import {ProductDto} from '../../../dtos/product.dto';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    DatePipe
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: ProductDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private productService: ProductService) {}

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

  getBadgeColor(type: string): 'success' | 'warning' | 'error' {
    if (type === 'Complete') return 'success';
    if (type === 'Pending') return 'warning';
    return 'error';
  }
}
