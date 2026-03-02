import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const roleguard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'];
  const userRole = authService.getUserRole();

  if (expectedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};