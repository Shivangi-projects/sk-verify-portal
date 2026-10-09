import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login)
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/dashboard/dashboard').then((m) => m.Dashboard)
    },
    {
        path: 'users',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./pages/users/users').then((m) => m.Users)
    },
    { path: '**', redirectTo: '' }
];