// src/routes/userRoutes.js
import express from "express";
const router = express.Router();
import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";

router.use("/auth", authRoute);
router.use("/users", userRoute);

export default router;