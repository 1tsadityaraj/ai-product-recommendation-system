import { searchAllStores } from "../services/ecommerceService.js";
import {
  extractBudget,
  detectCategory,
  extractFeatures,
  calculateRelevanceScore,
} from "../utils/aiHelper.js";

/**
 * Get similar products based on a product ID or category
 */
export const getSimilarProducts = async (req, res) => {
  try {
    const { productId, category, limit = 5 } = req.query;

    if (!productId && !category) {
      return res.status(400).json({ message: "productId or category is required" });
    }

    // For now, return products from the same category
    // In production, you'd fetch from e-commerce APIs with similar specs
    const query = category ? `${category} laptop` : "laptop";
    
    const products = await searchAllStores(query, {
      category: category || null,
    });

    // Filter out the current product and limit results
    const similar = products
      .filter(p => p.id !== productId)
      .slice(0, parseInt(limit));

    res.json(similar);
  } catch (error) {
    console.error("Error getting similar products:", error);
    res.status(500).json({ message: "Error fetching similar products", error: error.message });
  }
};

/**
 * Get trending/popular products
 */
export const getTrendingProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Search for popular queries
    const popularQueries = [
      "gaming laptop",
      "student laptop",
      "office laptop",
      "coding laptop"
    ];

    const allProducts = [];
    for (const query of popularQueries) {
      const products = await searchAllStores(query, {});
      allProducts.push(...products);
    }

    // Sort by rating (trending = highly rated)
    const trending = allProducts
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, parseInt(limit));

    res.json(trending);
  } catch (error) {
    console.error("Error getting trending products:", error);
    res.status(500).json({ message: "Error fetching trending products", error: error.message });
  }
};
