export interface User {
    id: number;
    userId: string;
    password: string;
    role: "Admin" | "General User";
    name: string;
}