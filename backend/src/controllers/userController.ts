import { Response } from "express";

import { users } from "../data/users";
import { AuthRequest } from "../types/AuthRequest";
import { adminRecords, userRecords } from "../data/records";

export const getMe = (
    req: AuthRequest,
    res: Response
) => {

    const currentUser = users.find(
        user => user.id === req.user?.id
    );

    if (!currentUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json({
        id: currentUser.id,
        name: currentUser.name,
        userId: currentUser.userId,
        role: currentUser.role
    });
};
export const getRecords = async (
    req: AuthRequest,
    res: Response
) => {

    const delay = Number(req.query.delay) || 0;

    await new Promise(resolve =>
        setTimeout(resolve, delay)
    );

    if (req.user?.role === "Admin") {
        return res.json(adminRecords);
    }

    return res.json(userRecords);
};