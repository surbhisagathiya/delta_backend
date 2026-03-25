// src/routes/settingsRoutes.js
import express from "express";
import { editLaverage, getLeverage } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// get laverage
router.get("/getLeverage", protect, getLeverage);
// edit leverage
router.put("/updateLeverage", protect, editLaverage);

export default router;
