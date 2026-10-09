import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { API_URL } from '../core/api.config';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class Auth {
    private http = inject(HttpClient);
    private router = inject(Router);

    readonly currentUser = signal<User | null>(null);
    readonly isAdmin = computed(() => this.currentUser()?.role === 'Admin');

    get token(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    get isLoggedIn(): boolean {
        return !!this.token;
    }

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${API_URL}/auth/login`, data).pipe(
            tap((res) => {
                localStorage.setItem(TOKEN_KEY, res.token);
                localStorage.setItem(USER_KEY, JSON.stringify(res.user));
                this.currentUser.set(res.user);
            })
        );
    }

    /** Runs once when the app starts: restores the session from the saved token. */
    restoreSession(): Observable<void> {
        if (!this.token) {
            return of(undefined);
        }

        return this.http.get<User>(`${API_URL}/me`).pipe(
            tap((user) => {
                this.currentUser.set(user);
                localStorage.setItem(USER_KEY, JSON.stringify(user));
            }),
            map(() => undefined),
            catchError(() => {
                this.clearSession();
                return of(undefined);
            })
        );
    }

    logout(): void {
        this.clearSession();
        void this.router.navigate(['/']);
    }

    private clearSession(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this.currentUser.set(null);
    }
}