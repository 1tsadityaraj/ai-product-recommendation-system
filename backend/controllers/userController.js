import User from "../models/User.js";
import SearchHistory from "../models/SearchHistory.js";
import Wishlist from "../models/Wishlist.js";
import { authenticate } from "../middleware/auth.js";

/**
 * Get or create a user (deprecated - use /api/auth/profile instead)
 */
export const getOrCreateUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Please register or login to access user data" });
    }

    let user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    res.json({ userId: user.userId, preferences: user.preferences });
  } catch (error) {
    console.error("Error getting/creating user:", error);
    res.status(500).json({ message: "Error getting user", error: error.message });
  }
};

/**
 * Update user preferences
 * Requires authentication - uses req.userId from middleware
 */
export const updateUserPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    let userId = req.userId || req.body.userId; // Support both authenticated and legacy

    if (!userId) {
      return res.status(400).json({ message: "User ID is required. Please login." });
    }

    // If authenticated with MongoDB _id, find user by _id
    let user;
    if (req.userId) {
      try {
        user = await User.findById(req.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        userId = user.userId; // Use the userId string for consistency
      } catch (error) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
    } else {
      // Legacy: find by userId string
      user = await User.findOne({ userId });
      if (!user) {
        user = new User({ userId });
      }
    }

    // Update preferences
    if (preferences.preferredCategories) {
      Object.entries(preferences.preferredCategories).forEach(([category, count]) => {
        const currentCount = user.preferences.preferredCategories.get(category) || 0;
        user.preferences.preferredCategories.set(category, currentCount + count);
      });
    }

    if (preferences.priceRange) {
      if (preferences.priceRange.min !== undefined) {
        if (!user.preferences.priceRange.min || preferences.priceRange.min < user.preferences.priceRange.min) {
          user.preferences.priceRange.min = preferences.priceRange.min;
        }
      }
      if (preferences.priceRange.max !== undefined) {
        if (!user.preferences.priceRange.max || preferences.priceRange.max > user.preferences.priceRange.max) {
          user.preferences.priceRange.max = preferences.priceRange.max;
        }
      }
    }

    if (preferences.preferredStores) {
      Object.entries(preferences.preferredStores).forEach(([store, count]) => {
        const currentCount = user.preferences.preferredStores.get(store) || 0;
        user.preferences.preferredStores.set(store, currentCount + count);
      });
    }

    if (preferences.averageBudget !== undefined) {
      if (!user.preferences.averageBudget) {
        user.preferences.averageBudget = preferences.averageBudget;
      } else {
        user.preferences.averageBudget = Math.round((user.preferences.averageBudget + preferences.averageBudget) / 2);
      }
    }

    await user.save();

    res.json({ userId: user.userId, preferences: user.preferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ message: "Error updating preferences", error: error.message });
  }
};

/**
 * Add search to history
 * Requires authentication - uses req.userId from middleware
 */
export const addSearchHistory = async (req, res) => {
  try {
    const { query, results } = req.body;
    const userId = req.userId || req.body.userId; // Support both authenticated and legacy

    if (!userId || !query) {
      return res.status(400).json({ message: "User ID and query are required. Please login." });
    }
    
    // Get user's userId string (not MongoDB _id)
    let userIdentifier = userId;
    try {
      const user = await User.findById(userId);
      if (user && user.userId) {
        userIdentifier = user.userId;
      }
    } catch (error) {
      // If userId is not a MongoDB ObjectId, assume it's already the userId string
      // This supports legacy userId format
    }

    // Extract categories from results
    const categories = new Map();
    results.forEach((product) => {
      if (product.category) {
        categories.set(product.category, (categories.get(product.category) || 0) + 1);
      }
    });

    // Calculate average price
    const prices = results.map((p) => p.price).filter((p) => p > 0);
    const averagePrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;

    const searchHistory = new SearchHistory({
      userId: userIdentifier,
      query,
      resultsCount: results.length,
      categories,
      averagePrice,
      products: results.map((p) => ({
        productId: p.id || p.productId,
        name: p.name,
        price: p.price,
        category: p.category,
        store: p.store,
      })),
    });

    await searchHistory.save();

    res.json({ success: true, searchHistory });
  } catch (error) {
    console.error("Error adding search history:", error);
    res.status(500).json({ message: "Error adding search history", error: error.message });
  }
};

/**
 * Get user search history
 * Supports both authenticated (req.userId) and legacy (userId param)
 */
export const getSearchHistory = async (req, res) => {
  try {
    let userId = req.userId || req.params.userId;
    
    // If authenticated, get user's userId string
    if (req.userId) {
      const user = await User.findById(req.userId);
      if (user) {
        userId = user.userId;
      }
    }
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required. Please login." });
    }
    
    const { limit = 50 } = req.query;

    const history = await SearchHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();

    // Convert Map to Object for JSON response
    const formattedHistory = history.map((item) => ({
      ...item,
      categories: Object.fromEntries(item.categories || []),
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error("Error getting search history:", error);
    res.status(500).json({ message: "Error getting search history", error: error.message });
  }
};

/**
 * Get or create user wishlist
 * Supports both authenticated (req.userId) and legacy (userId param)
 */
export const getWishlist = async (req, res) => {
  try {
    let userId = req.userId || req.params.userId;
    
    // If authenticated, get user's userId string
    if (req.userId) {
      const user = await User.findById(req.userId);
      if (user) {
        userId = user.userId;
      }
    }
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required. Please login." });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Error getting wishlist:", error);
    res.status(500).json({ message: "Error getting wishlist", error: error.message });
  }
};

/**
 * Add product to wishlist
 * Requires authentication - uses req.userId from middleware
 */
export const addToWishlist = async (req, res) => {
  try {
    const { product } = req.body;
    let userId = req.userId || req.body.userId;
    
    // If authenticated, get user's userId string
    if (req.userId) {
      const user = await User.findById(req.userId);
      if (user) {
        userId = user.userId;
      }
    }

    if (!userId || !product) {
      return res.status(400).json({ message: "User ID and product are required. Please login." });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    // Check if product already exists
    const exists = wishlist.products.some((p) => p.productId === (product.id || product.productId));
    if (exists) {
      return res.json({ message: "Product already in wishlist", wishlist });
    }

    wishlist.products.push({
      productId: product.id || product.productId,
      name: product.name,
      price: product.price,
      rating: product.rating,
      category: product.category,
      store: product.store,
      affiliateUrl: product.affiliateUrl,
      specs: product.specs,
      features: product.features,
      imageUrl: product.imageUrl,
    });

    await wishlist.save();

    res.json({ success: true, wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Error adding to wishlist", error: error.message });
  }
};

/**
 * Remove product from wishlist
 * Requires authentication - uses req.userId from middleware
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let userId = req.userId || req.body.userId;
    
    // If authenticated, get user's userId string
    if (req.userId) {
      const user = await User.findById(req.userId);
      if (user) {
        userId = user.userId;
      }
    }

    if (!userId || !productId) {
      return res.status(400).json({ message: "User ID and product ID are required. Please login." });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter((p) => p.productId !== productId);
    await wishlist.save();

    res.json({ success: true, wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Error removing from wishlist", error: error.message });
  }
};
