import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./auth/components/register/register.route').then(feature => feature.registerRoute),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/components/login/login.route').then(feature => feature.loginRoute),
  },
];
