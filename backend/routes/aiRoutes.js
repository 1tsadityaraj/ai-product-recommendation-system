import express from "express";
import { getRecommendations } from "../controllers/aiController.js";
import { getSimilarProducts, getTrendingProducts } from "../controllers/recommendationController.js";

const router = express.Router();

router.post("/ai-recommend", getRecommendations);
router.get("/similar", getSimilarProducts);
router.get("/trending", getTrendingProducts);

export default router;
