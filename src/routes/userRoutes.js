// src/routes/userRoutes.js
import express from "express";
import { getMe, getUsers, getAllUsers } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/", protect, admin, getUsers);
router.get("/all", getAllUsers);

export default router;