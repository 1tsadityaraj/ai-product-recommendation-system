import products from "../data/products.js";
import { searchAllStores } from "../services/ecommerceService.js";
import {
  extractBudget,
  detectCategory,
  extractFeatures,
  calculateRelevanceScore,
  generateExplanation
} from "../utils/aiHelper.js";

import { applyPersonalizationBoost } from "../utils/personalizationHelper.js";

export const getRecommendations = async (req, res) => {
  const { query, userPreferences } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    // 1️⃣ Advanced budget extraction
    const budget = extractBudget(query);

    // 2️⃣ Advanced category detection with synonyms
    const detectedCategory = detectCategory(query);

    // 3️⃣ Extract feature preferences
    const extractedFeatures = extractFeatures(query);

    // 4️⃣ Search real e-commerce stores
    let finalResults = [];
    
    try {
      // Try to get products from real e-commerce APIs
      finalResults = await searchAllStores(query, {
        budget,
        category: detectedCategory,
        features: extractedFeatures
      });
    } catch (ecommerceError) {
      console.warn("E-commerce API failed, using fallback:", ecommerceError.message);
      
      // Fallback to local product database if e-commerce APIs fail
      finalResults = getFallbackRecommendations(query, budget, detectedCategory, extractedFeatures);
    }

    // 5️⃣ Apply personalization boost based on user preferences
    if (userPreferences && Object.keys(userPreferences).length > 0) {
      finalResults = applyPersonalizationBoost(finalResults, userPreferences);
      // Re-sort by boosted relevance score
      finalResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }

    // 6️⃣ Remove internal scoring fields before sending response
    const cleanedResults = finalResults.map(({ relevanceScore, personalizationBoost, ...product }) => product);

    res.json(cleanedResults);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ message: "Error processing recommendation", error: error.message });
  }
};

/**
 * Fallback to local product database if e-commerce APIs are unavailable
 */
function getFallbackRecommendations(query, budget, detectedCategory, extractedFeatures) {
  // Filter products based on budget
  let filtered = products;
  if (budget) {
    if (budget.type === "range") {
      filtered = products.filter(p => p.price <= budget.max * 1.2);
    } else {
      filtered = products.filter(p => p.price <= budget.max * 1.2);
    }
  }

  // Calculate scores
  let scored = filtered.map(product => {
    const score = calculateRelevanceScore(
      product,
      query,
      detectedCategory,
      budget,
      extractedFeatures
    );

    return {
      ...product,
      relevanceScore: score,
      explanation: generateExplanation(product, query, detectedCategory, budget),
      store: "local", // Mark as local/demo products
      affiliateUrl: null // No affiliate link for local products
    };
  });

  // Sort and select top results
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  const finalResults = [];
  const usedCategories = new Set();
  const maxResults = 3;

  for (const product of scored) {
    if (finalResults.length >= maxResults) break;
    if (!usedCategories.has(product.category)) {
      finalResults.push(product);
      usedCategories.add(product.category);
    }
  }

  if (finalResults.length < maxResults) {
    for (const product of scored) {
      if (finalResults.length >= maxResults) break;
      if (!finalResults.find(p => p.id === product.id)) {
        finalResults.push(product);
      }
    }
  }

  return finalResults;
}