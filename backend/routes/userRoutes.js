import express from "express";
import {
  getOrCreateUser,
  updateUserPreferences,
  addSearchHistory,
  getSearchHistory,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/userController.js";
import { authenticate, optionalAuthenticate } from "../middleware/auth.js";

const router = express.Router();

// Legacy endpoint (deprecated)
router.post("/", getOrCreateUser);

// Protected routes (require authentication)
router.post("/preferences", optionalAuthenticate, updateUserPreferences);
router.post("/search-history", optionalAuthenticate, addSearchHistory);
router.get("/search-history", authenticate, getSearchHistory); // Get own history
router.get("/search-history/:userId", getSearchHistory); // Legacy support
router.get("/wishlist", authenticate, getWishlist); // Get own wishlist
router.get("/wishlist/:userId", getWishlist); // Legacy support
router.post("/wishlist/add", optionalAuthenticate, addToWishlist);
router.post("/wishlist/remove", optionalAuthenticate, removeFromWishlist);

export default router;
