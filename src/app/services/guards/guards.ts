import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {JwtService} from './jwt.service';

export const RevAuthGuard = () => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (!jwtService.isAuthorized()) return true;

  return router.parseUrl('/home');
};

export const AuthGuard = () => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (jwtService.isAuthorized()) return true;

  return router.parseUrl('/auth');
};

export const AdminGuard = () => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (jwtService.isAdmin()) return true;

  return router.parseUrl('/not-found');
};
