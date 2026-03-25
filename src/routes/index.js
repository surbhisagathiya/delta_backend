// src/routes/userRoutes.js
import express from "express";
const router = express.Router();
import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import deltaRoute from "./deltaRoutes.js";
import accountRoute from "./accountRoutes.js";
import settingsRoute from "./settingsRoutes.js";

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/delta", deltaRoute);
router.use("/accounts", accountRoute);
router.use("/settings", settingsRoute);

export default router;