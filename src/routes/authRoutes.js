// src/routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Log every request coming to /auth routes
router.use((req, res, next) => {
  console.log(`[AuthRoutes] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
});

// Register endpoint
router.post("/register", (req, res, next) => {
  console.log("[AuthRoutes] Register endpoint called");
  register(req, res, next);
});

// Login endpoint
router.post("/login", (req, res, next) => {
  console.log("[AuthRoutes] Login endpoint called");
  login(req, res, next);
});

export default router;