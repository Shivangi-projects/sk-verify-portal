import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../core/api.config';
import { User, UserInput } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private readonly url = `${API_URL}/users`;

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
    }

    createUser(data: UserInput): Observable<User> {
        return this.http.post<User>(this.url, data);
    }

    updateUser(id: number, data: Partial<UserInput>): Observable<User> {
        return this.http.put<User>(`${this.url}/${id}`, data);
    }

    deleteUser(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.url}/${id}`);
    }
}