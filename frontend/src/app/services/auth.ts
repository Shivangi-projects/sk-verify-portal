import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class Auth {

    private apiUrl = 'http://localhost:5001/api';

    constructor(private http: HttpClient) { }

    login(data: {
        userId: string;
        password: string;
        role: string;
    }) {
        return this.http.post(
            `${this.apiUrl}/auth/login`,
            data
        );
    }
}