// src/routes/userRoutes.js
import express from "express";
const router = express.Router();
import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import deltaRoute from "./deltaRoutes.js";

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/delta", deltaRoute);

export default router;