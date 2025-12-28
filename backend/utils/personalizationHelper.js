/**
 * Personalization helper functions for AI recommendations
 * Enhances recommendations based on user history and preferences
 */

/**
 * Boost product scores based on user preferences
 */
export function applyPersonalizationBoost(products, userPreferences) {
  if (!userPreferences || Object.keys(userPreferences).length === 0) {
    return products;
  }

  return products.map((product) => {
    let boost = 0;

    // Boost preferred categories
    if (userPreferences.preferredCategories && product.category) {
      const categoryCount = userPreferences.preferredCategories[product.category] || 0;
      if (categoryCount > 0) {
        // Boost based on how many times user has searched for this category
        boost += Math.min(categoryCount * 0.5, 3); // Max 3 point boost
      }
    }

    // Boost products within user's price range
    if (userPreferences.priceRange) {
      const { min, max } = userPreferences.priceRange;
      if (min && max && product.price >= min && product.price <= max) {
        boost += 2; // Significant boost for products in preferred price range
      } else if (userPreferences.averageBudget) {
        // Boost products close to average budget
        const diff = Math.abs(product.price - userPreferences.averageBudget);
        const budgetRange = userPreferences.averageBudget * 0.2; // 20% range
        if (diff <= budgetRange) {
          boost += 1; // Moderate boost
        }
      }
    }

    // Boost preferred stores
    if (userPreferences.preferredStores && product.store) {
      const storeCount = userPreferences.preferredStores[product.store] || 0;
      if (storeCount > 0) {
        boost += Math.min(storeCount * 0.3, 2); // Max 2 point boost
      }
    }

    return {
      ...product,
      personalizationBoost: boost,
      // Add boosted score to relevance score if it exists
      relevanceScore: (product.relevanceScore || 0) + boost,
    };
  });
}

/**
 * Generate personalized query suggestions based on history
 */
export function generatePersonalizedQuery(userPreferences, searchHistory) {
  const suggestions = [];

  // Suggest based on top categories
  if (userPreferences.preferredCategories) {
    const topCategory = Object.entries(userPreferences.preferredCategories)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (topCategory) {
      const [category] = topCategory;
      suggestions.push(`${category} laptop`);
      
      if (userPreferences.averageBudget) {
        suggestions.push(`${category} laptop under ₹${Math.round(userPreferences.averageBudget / 1000)}k`);
      }
    }
  }

  // Suggest based on recent searches
  if (searchHistory && searchHistory.length > 0) {
    const recentQuery = searchHistory[0].query;
    suggestions.push(recentQuery); // Re-suggest recent searches
  }

  // Suggest budget-based queries
  if (userPreferences.averageBudget) {
    suggestions.push(`laptop under ₹${Math.round(userPreferences.averageBudget / 1000)}k`);
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
}
