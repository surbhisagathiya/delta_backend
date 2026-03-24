// src/routes/authRoutes.js
import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

// Log every request coming to /auth routes
router.use((req, res, next) => {
  next();
});


// Login endpoint
router.post("/login", (req, res, next) => {
  login(req, res, next);
});


export default router;