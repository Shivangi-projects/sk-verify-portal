import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";

export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    if (req.user?.role !== "Admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
};