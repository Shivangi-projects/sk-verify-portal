import { Router } from "express";

import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/roleMiddleware";

import {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/adminController";

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get("/users", getUsers);

router.post("/users", createUser);

router.put("/users/:id", updateUser);

router.delete("/users/:id", deleteUser);

export default router;