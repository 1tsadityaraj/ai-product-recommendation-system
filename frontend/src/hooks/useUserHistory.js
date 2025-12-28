import { useState, useEffect } from "react";

const SEARCH_HISTORY_KEY = "ai_product_search_history";
const USER_PREFERENCES_KEY = "ai_product_user_preferences";

const MAX_HISTORY_ITEMS = 50;
const MAX_PREFERENCES_CATEGORIES = 10;

export const useUserHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    preferredCategories: {},
    priceRange: { min: null, max: null },
    preferredStores: {},
    averageBudget: null,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    const savedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);

    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error loading search history:", error);
      }
    }

    if (savedPreferences) {
      try {
        setUserPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Add search query to history
  const addToHistory = (query, results = []) => {
    const historyItem = {
      query,
      timestamp: new Date().toISOString(),
      resultsCount: results.length,
      categories: extractCategories(results),
      averagePrice: calculateAveragePrice(results),
    };

    setSearchHistory((prev) => {
      // Remove duplicates (same query)
      const filtered = prev.filter((item) => item.query.toLowerCase() !== query.toLowerCase());
      // Add new item at the beginning
      const updated = [historyItem, ...filtered];
      // Limit to max items
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });

    // Update preferences based on this search
    updatePreferencesFromSearch(historyItem, results);
  };

  // Extract categories from search results
  const extractCategories = (results) => {
    const categories = {};
    results.forEach((product) => {
      if (product.category) {
        categories[product.category] = (categories[product.category] || 0) + 1;
      }
    });
    return categories;
  };

  // Calculate average price from results
  const calculateAveragePrice = (results) => {
    if (results.length === 0) return null;
    const total = results.reduce((sum, product) => sum + (product.price || 0), 0);
    return Math.round(total / results.length);
  };

  // Update user preferences based on search behavior
  const updatePreferencesFromSearch = (historyItem, results) => {
    setUserPreferences((prev) => {
      const updated = { ...prev };

      // Update preferred categories
      Object.entries(historyItem.categories).forEach(([category, count]) => {
        updated.preferredCategories[category] = (updated.preferredCategories[category] || 0) + count;
      });

      // Update price range
      if (historyItem.averagePrice) {
        const prices = results.map((p) => p.price).filter((p) => p > 0);
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          if (!updated.priceRange.min || minPrice < updated.priceRange.min) {
            updated.priceRange.min = minPrice;
          }
          if (!updated.priceRange.max || maxPrice > updated.priceRange.max) {
            updated.priceRange.max = maxPrice;
          }
        }

        // Update average budget
        const allPrices = results.map((p) => p.price).filter((p) => p > 0);
        if (allPrices.length > 0) {
          const avg = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
          if (!updated.averageBudget) {
            updated.averageBudget = Math.round(avg);
          } else {
            // Weighted average
            updated.averageBudget = Math.round((updated.averageBudget + avg) / 2);
          }
        }
      }

      // Update preferred stores
      results.forEach((product) => {
        if (product.store) {
          updated.preferredStores[product.store] = (updated.preferredStores[product.store] || 0) + 1;
        }
      });

      return updated;
    });
  };

  // Get most searched categories
  const getTopCategories = (limit = 3) => {
    const categoryCounts = {};
    searchHistory.forEach((item) => {
      Object.keys(item.categories).forEach((category) => {
        categoryCounts[category] = (categoryCounts[category] || 0) + item.categories[category];
      });
    });

    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([category]) => category);
  };

  // Get recent searches
  const getRecentSearches = (limit = 5) => {
    return searchHistory.slice(0, limit);
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
  };

  // Clear preferences
  const clearPreferences = () => {
    setUserPreferences({
      preferredCategories: {},
      priceRange: { min: null, max: null },
      preferredStores: {},
      averageBudget: null,
    });
  };

  // Get personalized suggestions based on history
  const getPersonalizedSuggestions = () => {
    const suggestions = {
      suggestedCategories: getTopCategories(3),
      suggestedBudget: userPreferences.averageBudget,
      priceRange: userPreferences.priceRange,
      topStores: Object.entries(userPreferences.preferredStores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([store]) => store),
    };
    return suggestions;
  };

  return {
    searchHistory,
    userPreferences,
    addToHistory,
    getRecentSearches,
    getTopCategories,
    getPersonalizedSuggestions,
    clearHistory,
    clearPreferences,
  };
};
