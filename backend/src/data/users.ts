import bcrypt from "bcryptjs";
import { User } from "../types/User";

export const users: User[] = [
    {
        id: 1,
        userId: "admin",
        password: bcrypt.hashSync("admin123", 10),
        role: "Admin",
        name: "Admin User"
    },
    {
        id: 2,
        userId: "user1",
        password: bcrypt.hashSync("user123", 10),
        role: "General User",
        name: "General User"
    }
];
