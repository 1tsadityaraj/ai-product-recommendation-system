import { searchFlipkartProducts } from "./flipkartService.js";
import { searchAmazonProducts } from "./amazonService.js";
import {
  extractBudget,
  detectCategory,
  extractFeatures,
  calculateRelevanceScore,
  generateExplanation
} from "../utils/aiHelper.js";

/**
 * Unified E-Commerce Service
 * Searches multiple stores and returns best matches
 */

/**
 * Search products across all e-commerce stores
 * @param {string} query - User search query
 * @param {Object} filters - Budget, category, features
 * @returns {Promise<Array>} Array of best matching products
 */
export async function searchAllStores(query, filters = {}) {
  try {
    // Search both stores in parallel
    const [flipkartProducts, amazonProducts] = await Promise.all([
      searchFlipkartProducts(query, 20),
      searchAmazonProducts(query, 20)
    ]);

    // Combine products from all stores
    const allProducts = [...flipkartProducts, ...amazonProducts];

    // Remove duplicates (by name similarity)
    const uniqueProducts = removeDuplicates(allProducts);

    // Apply AI scoring and filtering
    const scored = uniqueProducts.map(product => {
      const score = calculateRelevanceScore(
        product,
        query,
        filters.category || detectCategory(query),
        filters.budget || extractBudget(query),
        filters.features || extractFeatures(query)
      );

      return {
        ...product,
        relevanceScore: score,
        explanation: generateExplanation(
          product,
          query,
          filters.category || detectCategory(query),
          filters.budget || extractBudget(query)
        )
      };
    });

    // Sort by relevance score
    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Return top results (with diversity)
    return selectTopWithDiversity(scored, 3);
  } catch (error) {
    console.error("Error searching stores:", error.message);
    throw error;
  }
}

/**
 * Remove duplicate products based on name similarity
 */
function removeDuplicates(products) {
  const seen = new Set();
  const unique = [];

  for (const product of products) {
    // Normalize product name for comparison
    const normalized = product.name.toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Check if similar product already exists
    let isDuplicate = false;
    for (const existing of seen) {
      if (similarity(normalized, existing) > 0.8) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.add(normalized);
      unique.push(product);
    }
  }

  return unique;
}

/**
 * Calculate string similarity (simple Jaccard similarity)
 */
function similarity(str1, str2) {
  const words1 = new Set(str1.split(' '));
  const words2 = new Set(str2.split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Select top products with diversity (mix of stores and categories)
 */
function selectTopWithDiversity(scored, limit) {
  const results = [];
  const usedStores = new Set();
  const usedCategories = new Set();

  // First pass: prioritize diversity
  for (const product of scored) {
    if (results.length >= limit) break;

    const storeNew = !usedStores.has(product.store);
    const categoryNew = !usedCategories.has(product.category);

    if (storeNew || categoryNew) {
      results.push(product);
      usedStores.add(product.store);
      usedCategories.add(product.category);
    }
  }

  // Second pass: fill remaining slots with highest scores
  if (results.length < limit) {
    for (const product of scored) {
      if (results.length >= limit) break;
      if (!results.find(p => p.id === product.id)) {
        results.push(product);
      }
    }
  }

  return results;
}

/**
 * Compare prices across stores for a specific product
 */
export async function comparePrices(productName) {
  try {
    const [flipkart, amazon] = await Promise.all([
      searchFlipkartProducts(productName, 5),
      searchAmazonProducts(productName, 5)
    ]);

    // Find matching products
    const matches = [];
    for (const fk of flipkart) {
      for (const amz of amazon) {
        if (similarity(fk.name.toLowerCase(), amz.name.toLowerCase()) > 0.7) {
          matches.push({
            name: fk.name,
            flipkart: { price: fk.price, url: fk.affiliateUrl },
            amazon: { price: amz.price, url: amz.affiliateUrl },
            bestPrice: Math.min(fk.price, amz.price),
            savings: Math.abs(fk.price - amz.price)
          });
        }
      }
    }

    return matches.sort((a, b) => a.bestPrice - b.bestPrice);
  } catch (error) {
    console.error("Error comparing prices:", error.message);
    return [];
  }
}
