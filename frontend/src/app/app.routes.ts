import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Users } from './pages/users/users';
import { AuthGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
    { path: '', component: Login },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: Users,
        canActivate: [AuthGuard, AdminGuard]
    },
    { path: '**', redirectTo: '' }
];