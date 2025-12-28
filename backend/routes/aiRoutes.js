import express from "express";
import products from "../data/scrapedProducts.js";

const router = express.Router();

router.post("/ai-recommend", (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Extract budget from query (e.g. "under 30000")
    const budgetMatch = query.match(/under\s*(\d+)/i);
    const budget = budgetMatch ? Number(budgetMatch[1]) : Infinity;

    // Filter products by budget
    let results = products.filter((p) => p.price <= budget);

    // Sort by price (cheapest first)
    results.sort((a, b) => a.price - b.price);

    // Return top 5 results
    results = results.slice(0, 5);

    res.json(results);
  } catch (error) {
    console.error("AI recommend error:", error);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

export default router;
