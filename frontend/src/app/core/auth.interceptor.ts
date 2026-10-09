import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(Auth);
    const token = auth.token;

    const request = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            // Expired or invalid token: log out and go to the login page.
            // (A wrong password on the login form also returns 401, so skip that call.)
            if (error.status === 401 && !req.url.includes('/auth/login')) {
                auth.logout();
            }
            return throwError(() => error);
        })
    );
};