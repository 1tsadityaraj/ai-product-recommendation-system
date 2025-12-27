import express from "express";
import { getRecommendations } from "../controllers/aiController.js";

const router = express.Router();

router.post("/ai-recommend", getRecommendations);

export default router;
