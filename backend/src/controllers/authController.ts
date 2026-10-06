import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { users } from "../data/users";
import { generateToken } from "../utils/jwt";

export const login = async (
    req: Request,
    res: Response
) => {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
        return res.status(400).json({
            message: "userId, password and role are required"
        });
    }

    const user = users.find(
        u =>
            u.userId === userId &&
            u.role === role
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const token = generateToken(
        user.id,
        user.role
    );

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            userId: user.userId,
            role: user.role
        }
    });
};