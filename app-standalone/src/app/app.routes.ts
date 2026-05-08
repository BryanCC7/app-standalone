import { Routes } from '@angular/router';
import { ProductComponent } from './features/products/components/product/product';
import { Welcome } from './features/home/welcome/welcome';
import { PageNotFound } from './features/not-found/page-not-found/page-not-found';

export const routes: Routes = [
  { path: 'home', component: Welcome },
  { path: 'products', component: ProductComponent },
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  { path: '**', component: PageNotFound }
];