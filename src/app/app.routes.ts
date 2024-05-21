import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./auth/components/register/register.routes').then(feature => feature.registerRoutes),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/components/login/login.routes').then(feature => feature.loginRoutes),
  },
];
