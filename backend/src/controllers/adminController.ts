import { Request, Response } from "express";
import bcrypt from "bcryptjs";

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
    req: Request,
    res: Response
) => {

    const { userId, password, role, name } = req.body;

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const newUser = {
        id: users.length + 1,
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

    user.name = name || user.name;
    user.role = role || user.role;

    res.json(user);
};

export const deleteUser = (
    req: Request,
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

    users.splice(index, 1);

    res.json({
        message: "User deleted"
    });
};