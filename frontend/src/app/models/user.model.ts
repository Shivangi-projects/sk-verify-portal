export type Role = 'Admin' | 'General User';

export interface User {
    id: number;
    userId: string;
    name: string;
    role: Role;
}

export interface LoginRequest {
    userId: string;
    password: string;
    role: Role;
}

export interface LoginResponse {
    token: string;
    user: User;
}
export interface UserInput {
    userId: string;
    name: string;
    password?: string;
    role: Role;
}