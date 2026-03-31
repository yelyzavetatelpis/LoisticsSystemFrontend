import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  // attach token to every request if user is logged in
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next(cloned).pipe(
      catchError((error) => {
        // clear storage and redirect to login when token expries
        if (error.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('firstName');
          localStorage.removeItem('currentUser');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  // no token
  return next(req);
};


