import { Routes } from '@angular/router';
import {AppLayoutComponent} from './shared/layout/app-layout/app-layout.component';
import {ProductListComponent} from './shared/components/product/product-list/product-list.component';
import {CreateProductComponent} from './shared/components/product/create-product/create-product.component';
import {EditProductComponent} from './shared/components/product/edit-product/edit-product.component';

export const routes: Routes = [
  {
    path:'',
    component: AppLayoutComponent,
    children:[
      {
        path: 'products',
        component: ProductListComponent,
        title: 'Angular Basic Tables Dashboard | List of Products',
        children:[

        ]
      },
      {
        path: 'new-product',
        component: CreateProductComponent,
        title: 'Angular Basic Tables Dashboard | Create Product',
      },
      {
        path: 'edit-product/:id',
        component: EditProductComponent,
        title: 'Angular Basic Tables Dashboard | Edit Product',
      },
    ]
  },



];
