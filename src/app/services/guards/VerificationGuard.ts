import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './AuthService';

export const RevAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) return true;

  return router.parseUrl('/home');
};

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;

  return router.parseUrl('/auth');
};

