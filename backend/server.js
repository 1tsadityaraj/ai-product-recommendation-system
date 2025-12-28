import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", aiRoutes);

// Health check (important)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ✅ IMPORTANT FOR VERCEL
export default app;
