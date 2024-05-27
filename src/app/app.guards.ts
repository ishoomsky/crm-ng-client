import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "@app/auth/services/auth.service";

export const AlreadyLoggedInGuard : CanActivateFn = () => {
  // Guard for login and register pages
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    router.navigateByUrl('home');
    return false;
  } else {
    return true;
  }
};

export const AuthenticatedUserGuard : CanActivateFn = () => {
  // Main auth guard
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigateByUrl('login');
    return false;
  } else {
    return true;
  }
};
