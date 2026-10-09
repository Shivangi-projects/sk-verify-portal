import { Injectable } from '@angular/core';

const API_URL = 'http://localhost:5001/api/users';

export interface User {
    id: number;
    userId: string;
    name: string;
    role: 'Admin' | 'General User';
}

export interface UserInput {
    userId: string;
    name: string;
    password?: string;
    role: 'Admin' | 'General User';
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = API_URL;

    private getHeaders(token: string): HeadersInit {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        };
    }

    async getUsers(token: string): Promise<User[]> {
        const response = await fetch(this.apiUrl, {
            method: 'GET',
            headers: this.getHeaders(token)
        });

        if (!response.ok) {
            const result = await response.json().catch(() => ({}));

            throw new Error(
                result.message || `Unable to load users (${response.status}).`
            );
        }

        const users: unknown = await response.json();

        if (!Array.isArray(users)) {
            throw new Error('Unexpected response received from the server.');
        }

        return users as User[];
    }

    async createUser(token: string, data: UserInput): Promise<User> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: this.getHeaders(token),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            throw new Error(result.message || 'Unable to create user.');
        }

        return response.json();
    }

    async updateUser(
        token: string,
        id: number,
        data: Partial<UserInput>
    ): Promise<User> {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(token),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            throw new Error(result.message || 'Unable to update user.');
        }

        return response.json();
    }

    async deleteUser(token: string, id: number): Promise<void> {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(token)
        });

        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            throw new Error(result.message || 'Unable to delete user.');
        }
    }
}