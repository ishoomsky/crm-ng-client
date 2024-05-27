import { Routes } from '@angular/router';
import { AlreadyLoggedInGuard, AuthenticatedUserGuard } from "@app/app.guards";

export const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('@app/auth/components/register/register.route').then(feature => feature.registerRoute),
    canActivate: [AlreadyLoggedInGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('@app/auth/components/login/login.route').then(feature => feature.loginRoute),
    canActivate: [AlreadyLoggedInGuard],
  },
  {
    path: 'boards',
    loadChildren: () => import('@app/boards/components/boards/boards.route').then(feature => feature.boardsRoute),
    canActivate: [AuthenticatedUserGuard],
  },
  {
    path: '',
    loadChildren: () => import('@app/home/components/home/home.route').then(feature => feature.homeRoute),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
