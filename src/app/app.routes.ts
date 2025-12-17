import { Routes } from '@angular/router';
import {AppLayoutComponent} from './shared/layout/app-layout/app-layout.component';
import {ProductListComponent} from './shared/components/product/product-list/product-list.component';

export const routes: Routes = [
  {
    path:'',
    component: AppLayoutComponent,
    children:[
      {
        path: 'products',
        component: ProductListComponent,
        title: 'Angular Basic Tables Dashboard | List of Products',
      },
    ]
  },

];
