// src/routes/userRoutes.js
import express from "express";
import { getMe, getUsers, getAllUsers, upsertUser, assignUser, getUsersData } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/", protect, admin, getUsers);
router.get("/all", getAllUsers)

// upsertUser endpoint
router.post("/upsertUser", protect, admin, upsertUser);
// assign user
router.post("/assignUser", protect, admin, assignUser);
//get all user data
router.get("/getUsersData", protect, admin, getUsersData);

export default router;