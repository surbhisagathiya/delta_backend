// src/routes/accountRoutes.js
import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";
import { deleteAccount, getAccounts, upsertAccount } from "../controllers/accountController.js";

const router = express.Router();

// Get all accounts (admin) or accounts assigned to the logged-in user
router.get("/getAllAccounts", protect, getAccounts);

// Add or edit an account
router.post("/upsertAccount", protect, admin, upsertAccount);

// Delete an account
router.delete("/deleteAccount/:id", protect, admin, deleteAccount);

export default router;