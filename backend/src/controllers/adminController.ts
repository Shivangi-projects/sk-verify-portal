import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../types/AuthRequest";

import { users } from "../data/users";

export const getUsers = (
    req: Request,
    res: Response
) => {

    const safeUsers = users.map(
        ({ password, ...user }) => user
    );

    res.json(safeUsers);
};

export const createUser = async (
    req: AuthRequest,
    res: Response
) => {

    const { userId, password, role, name } = req.body;

    if (!userId || !password || !role || !name) {
        return res.status(400).json({
            message: "All fields are required"
        });

    }
    if (String(password).length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });
    }

    if (
        role !== "Admin" &&
        role !== "General User"
    ) {
        return res.status(400).json({
            message: "Invalid role"
        });
    }

    const existingUser = users.find(
        u => u.userId === userId
    );

    if (existingUser) {
        return res.status(409).json({
            message: "User ID already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const highestId =
        users.length > 0
            ? Math.max(...users.map(u => u.id))
            : 0;

    const newUser = {
        id: highestId + 1,
        userId,
        password: hashedPassword,
        role,
        name
    };

    users.push(newUser);

    const { password: _, ...safeUser } = newUser;

    res.status(201).json(safeUser);
};
export const updateUser = async (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const user = users.find(
        u => u.id === id
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const { name, role } = req.body;
    if (
        role &&
        role !== "Admin" &&
        role !== "General User"
    ) {
        return res.status(400).json({
            message: "Invalid role"
        });
    }
    const adminCount = users.filter(u => u.role === "Admin").length;

    if (user.role === "Admin" && role === "General User" && adminCount === 1) {
        return res.status(400).json({
            message: "There must be at least one Admin"
        });
    }
    user.name = name || user.name;
    user.role = role || user.role;

    const { password, ...safeUser } = user;

    res.json(safeUser);
};

export const deleteUser = (
    req: AuthRequest,
    res: Response
) => {

    const id = Number(req.params.id);

    const index = users.findIndex(
        u => u.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    if (req.user?.id === id) {
        return res.status(400).json({
            message: "You cannot delete your own account"
        });
    }
    users.splice(index, 1);

    res.json({
        message: "User deleted"
    });
};