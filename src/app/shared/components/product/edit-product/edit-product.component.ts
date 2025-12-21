import { Component } from '@angular/core';
import {UpdateProductDto} from '../../../dtos/product/update-product.dto';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiError, ProductService} from '../../../services/product.service';
import {AlertService} from '../../../services/alert.service';
import {ProductDto} from '../../../dtos/product/product.dto';
import {firstValueFrom} from 'rxjs';
import {PageBreadcrumbComponent} from '../../common/page-breadcrumb/page-breadcrumb.component';
import {ComponentCardComponent} from '../../common/component-card/component-card.component';
import {LabelComponent} from '../../form/label/label.component';
import {InputFieldComponent} from '../../form/input-field/input-field.component';
import {FormsModule} from '@angular/forms';
import {TextAreaComponent} from '../../form/text-area/text-area.component';
import {SelectComponent} from '../../form/select/select.component';

@Component({
  selector: 'app-edit-product',
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    LabelComponent,
    InputFieldComponent,
    FormsModule,
    TextAreaComponent,
    SelectComponent
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent {
  providers = [
    { value: '1', label: 'Provider 1' },
    { value: '2', label: 'Provider 2' },
    { value: '3', label: 'Provider 3' },
    { value: '4', label: 'Provider 4' },
  ];

  productId = 0;

  // form for update
  form: UpdateProductDto = {
    title: '',
    description: '',
    providerId: 0,
    price: 0,
    imageSrc: '',
  };

  // ui state
  isLoading = true;
  isSubmitting = false;

  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private alert: AlertService
  ) {}

  get isValid(): boolean {
    return (
      this.form.title.trim().length > 0 &&
      this.form.description.trim().length > 0 &&
      Number(this.form.providerId) > 0 &&
      Number(this.form.price) > 0
    );
  }

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!Number.isFinite(id) || id <= 0) {
      this.isLoading = false;
      await this.alert.error('Invalid route', 'Product id is not valid.');
      await this.router.navigate(['/products']);
      return;
    }

    this.productId = id;
    await this.loadProduct(id);
  }

  private async loadProduct(id: number): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const product: ProductDto = await firstValueFrom(this.productService.getById(id));

      // Fill update form
      this.form = {
        title: product.title ?? '',
        description: product.description ?? '',
        providerId: Number(product.providerId ?? 0),
        price: Number(product.price ?? 0),
        imageSrc: product.imageSrc ?? '',
      };
    } catch (err: any) {
      const apiErr = err as ApiError;

      // common 404 handling
      if (apiErr?.status === 404) {
        await this.alert.error('Not found', 'This product does not exist.');
        await this.router.navigate(['/products']);
        return;
      }

      this.errorMessage = apiErr?.message ?? 'Failed to load product.';
      await this.alert.error('Load failed', this.errorMessage);
      console.error('GetById error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async submit(): Promise<void> {
    this.errorMessage = null;

    if (!this.isValid) {
      await this.alert.warning('Invalid form', 'Please fill all required fields correctly.');
      return;
    }

    this.isSubmitting = true;

    const payload: UpdateProductDto = {
      ...this.form,
      providerId: Number(this.form.providerId),
      price: Number(this.form.price),
    };

    try {
      await firstValueFrom(this.productService.update(this.productId, payload));

      await this.alert.success('Updated!', 'Product updated successfully.');
      await this.router.navigate(['/products']);
    } catch (err: any) {
      const apiErr = err as ApiError;

      if (apiErr?.status === 404) {
        await this.alert.error('Not found', 'This product does not exist anymore.');
        await this.router.navigate(['/products']);
        return;
      }

      this.errorMessage = apiErr?.message ?? 'Failed to update product.';
      await this.alert.error('Update failed', this.errorMessage);
      console.error('Update error:', err);
    } finally {
      this.isSubmitting = false;
    }
  }

  async cancel(): Promise<void> {
    await this.router.navigate(['/products']);
  }
}
