import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import index from "../src/routes/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS setup: allow frontend + Postman/curl
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Debugging: log all requests
app.use((req, res, next) => {
  console.log(`[App] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
});

// Routes
app.use("/api", index);


// Health check
app.get("/", (_, res) => {
  console.log("[App] Health check hit");
  res.status(200).json({ message: "Trading API Running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[App] Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

export default app;