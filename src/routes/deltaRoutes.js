import express from "express";
import {
  getOpenOrders,
  getPositions,
  getTicker,
} from "../controllers/deltaController.js";

const router = express.Router();

router.get("/ticker/:symbol", getTicker);

router.get("/positions/:symbol", getPositions);
router.get("/open-orders/:symbol", getOpenOrders);

export default router;
