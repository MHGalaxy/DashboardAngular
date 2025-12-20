import { Component } from '@angular/core';
import {PageBreadcrumbComponent} from '../../common/page-breadcrumb/page-breadcrumb.component';
import {ComponentCardComponent} from '../../common/component-card/component-card.component';
import {LabelComponent} from '../../form/label/label.component';
import {InputFieldComponent} from '../../form/input-field/input-field.component';
import {SelectComponent} from '../../form/select/select.component';
import {TextAreaComponent} from '../../form/text-area/text-area.component';
import {CreateProductDto} from '../../../dtos/product/create-product.dto';
import {ApiError, ProductService} from '../../../services/product.service';

@Component({
  selector: 'app-create-product',
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
    TextAreaComponent
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
  selectedOption = '';

  // form state (no ngModel)
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

  constructor(private productService: ProductService) {}

  // input handlers
  onTitleChange(value: string | number) {
    this.form.title = String(value);
  }

  onDescriptionChange(value: string) {
    this.form.description = value;
  }

  onProviderChange(value: string) {
    this.form.providerId = Number(value);
  }

  onPriceChange(value: string | number) {
    const n = typeof value === 'number' ? value : Number(value);
    this.form.price = Number.isFinite(n) ? n : 0;
  }

  onImageSrcChange(value: string | number) {
    this.form.imageSrc = String(value);
  }

  // simple validation
  get isValid(): boolean {
    return (
      this.form.title.trim().length > 0 &&
      this.form.description.trim().length > 0 &&
      this.form.providerId > 0 &&
      this.form.price > 0
      // imageSrc can be optional depending on your backend
    );
  }

  submit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.isValid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.isSubmitting = true;

    this.productService.create(this.form).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.successMessage = `Product created (ID: ${created.productId})`;

        // reset the form if you want
        this.form = { title: '', description: '', providerId: 0, price: 0, imageSrc: '' };
      },
      error: (err: ApiError) => {
        this.isSubmitting = false;
        this.errorMessage = err.message ?? 'Failed to create product.';
        console.error('Create product error:', err);
      },
    });
  }

  // handleSelectChange(value: string) {
  //   this.selectedOption = value;
  //   console.log('Selected value:', value);
  // }
  //
  // onTimeSelected(time: string) {
  //   console.log('Picked time:', time); // e.g. "10:45"
  // }
}
