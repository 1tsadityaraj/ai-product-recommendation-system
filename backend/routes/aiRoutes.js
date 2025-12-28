import express from "express";
import products from "../data/scrapedProducts.js";

const router = express.Router();

router.post("/ai-recommend", (req, res) => {
  try {
    const { query } = req.body;

    const budgetMatch = query.match(/under\s*(\d+)/i);
    const budget = budgetMatch ? Number(budgetMatch[1]) : Infinity;

    const results = products
      .filter((p) => p.price <= budget)
      .sort((a, b) => a.price - b.price)
      .slice(0, 5);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

export default router;
