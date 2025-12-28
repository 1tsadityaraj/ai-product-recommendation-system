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

    // Filter & sort products
    const results = products
      .filter((p) => p.price <= budget)
      .sort((a, b) => a.price - b.price)
      .slice(0, 5);

    // 🔗 Real marketplace search links
    const amazonSearchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    const flipkartSearchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

    // ✅ Final response
    res.json({
      recommendations: results,
      stores: {
        amazon: amazonSearchUrl,
        flipkart: flipkartSearchUrl,
      },
    });
  } catch (err) {
    console.error("AI recommend error:", err);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

export default router;
