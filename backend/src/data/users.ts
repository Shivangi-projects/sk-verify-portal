import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { User } from "../types/User";

const DATA_FILE = path.join(__dirname, "../../data/users.json");

const writeFile = (list: User[]): void => {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
};

const seedUsers = (): User[] => [
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

const loadUsers = (): User[] => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as User[];
        }
    } catch (error) {
        console.error("Could not read users file, using seed data.", error);
    }

    const seed = seedUsers();
    writeFile(seed);
    return seed;
};

export const users: User[] = loadUsers();

export const saveUsers = (): void => writeFile(users);