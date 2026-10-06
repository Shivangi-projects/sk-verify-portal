import { Router } from "express";

import {
    getMe,
    getRecords
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", protect, getMe);
router.get(
    "/records",
    protect,
    getRecords
);

export default router;