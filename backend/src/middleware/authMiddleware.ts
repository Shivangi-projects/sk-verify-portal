import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AuthRequest } from "../types/AuthRequest";

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    if (typeof token !== "string") {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        if (
            typeof decoded === "string" ||
            !("id" in decoded) ||
            !("role" in decoded)
        ) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        req.user = {
            id: decoded.id as number,
            role: decoded.role as string
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};