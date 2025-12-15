import { Routes } from '@angular/router';
import {AppLayoutComponent} from './shared/layout/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path:'',
    component: AppLayoutComponent,
    children:[
      // {
      //   path:'forms',
      //   component:BasicTablesComponent,
      //   title:'Angular Basic Tables Dashboard | TailAdmin - Angular Admin Dashboard Template'
      // },
    ]
  },

];
