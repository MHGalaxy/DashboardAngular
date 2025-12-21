import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PageBreadcrumbComponent } from '../../common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../common/component-card/component-card.component';
import { LabelComponent } from '../../form/label/label.component';
import { InputFieldComponent } from '../../form/input-field/input-field.component';
import { SelectComponent } from '../../form/select/select.component';
import { TextAreaComponent } from '../../form/text-area/text-area.component';

import { CreateProductDto } from '../../../dtos/product/create-product.dto';
import { ApiError, ProductService } from '../../../services/product.service';
import {AlertService} from '../../../services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-product',
  imports: [
    FormsModule, // ✅ required for ngModel
    PageBreadcrumbComponent,
    ComponentCardComponent,
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
    TextAreaComponent,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {
  providers = [
    { value: '1', label: 'Provider 1' },
    { value: '2', label: 'Provider 2' },
    { value: '3', label: 'Provider 3' },
    { value: '4', label: 'Provider 4' },
  ];

  form: CreateProductDto = {
    title: '',
    description: '',
    providerId: 0,
    price: 0,
    imageSrc: '',
  };

  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private alert: AlertService,
    private router: Router
  ) {}

  get isValid(): boolean {
    return (
      this.form.title.trim().length > 0 &&
      this.form.description.trim().length > 0 &&
      this.form.providerId > 0 &&
      this.form.price > 0
    );
  }

  submit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.isValid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      this.alert.warning('Invalid form',  this.errorMessage);
      return;
    }

    this.isSubmitting = true;

    // ensure correct types (providerId/price could come as string from select)
    const payload: CreateProductDto = {
      ...this.form,
      providerId: Number(this.form.providerId),
      price: Number(this.form.price),
    };

    this.productService.create(payload).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.successMessage = `Product created successfully (ID: ${created.productId}).`;
        this.alert.success('Created!',  this.successMessage);

        this.form = { title: '', description: '', providerId: 0, price: 0, imageSrc: '' };
        this.router.navigate(['products']);
      },
      error: (err: ApiError) => {
        this.isSubmitting = false;
        this.errorMessage = err.message ?? 'Failed to create product.';
        this.alert.error('Create failed', this.errorMessage);
        console.error('Create product error:', err);
      },
    });
  }
}
