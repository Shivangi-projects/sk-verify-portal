import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean | UrlTree {
        if (typeof window === 'undefined') {
            return true;
        }

        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            return this.router.createUrlTree(['/']);
        }

        try {
            const user = JSON.parse(userData);

            return user.role === 'Admin'
                ? true
                : this.router.createUrlTree(['/dashboard']);
        } catch {
            return this.router.createUrlTree(['/']);
        }
    }
}