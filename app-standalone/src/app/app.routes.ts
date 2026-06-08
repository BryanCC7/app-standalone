import { Routes } from '@angular/router';
import { ProductComponent } from './features/products/components/product/product';
import { Welcome } from './features/home/welcome/welcome';
import { PageNotFound } from './features/not-found/page-not-found/page-not-found';
import {Login} from './features/auth/components/login/login';

import { Number } from './features/numbers/components/number/number';
import { User } from './features/users/components/user/user';

import { loginGuard } from './features/auth/guards/login-guard';

export const routes: Routes = [

  
  { path: 'home', component: Welcome, canActivate: [loginGuard] },
  { path: 'products', component: ProductComponent, canActivate:[loginGuard] },
  { path: 'numbers', component: Number, canActivate: [loginGuard] },
  { path: 'users', component: User, canActivate:[loginGuard]},
  { path: 'login', component:Login},
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  { path: '**', component: PageNotFound }
];