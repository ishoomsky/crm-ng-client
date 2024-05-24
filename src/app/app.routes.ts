import { Routes } from '@angular/router';
import { AuthenticatedUserGuard, NonAuthenticatedUserGuard } from "@app/app.guards";

export const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('@app/auth/components/register/register.route').then(feature => feature.registerRoute),
    canActivate: [AuthenticatedUserGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('@app/auth/components/login/login.route').then(feature => feature.loginRoute),
    canActivate: [AuthenticatedUserGuard],
  },
  {
    path: 'home',
    loadChildren: () => import('@app/home/components/home/home.route').then(feature => feature.homeRoute),
  }
];
