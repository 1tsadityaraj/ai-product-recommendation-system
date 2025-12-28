import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserWishlist, addToWishlistAPI, removeFromWishlistAPI } from "../services/userApi";

const WISHLIST_KEY = "ai_product_wishlist";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load wishlist on mount
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          // Load from backend API if authenticated
          const response = await getUserWishlist();
          const products = (response.products || []).map(p => ({
            ...p,
            id: p.productId || p.id, // Ensure id field exists
          }));
          setWishlist(products);
          // Also sync to localStorage for offline access
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(products));
        } else {
          // Load from localStorage if not authenticated
          const saved = localStorage.getItem(WISHLIST_KEY);
          if (saved) {
            try {
              setWishlist(JSON.parse(saved));
            } catch (error) {
              console.error("Error loading wishlist:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
        // Fallback to localStorage on error
        const saved = localStorage.getItem(WISHLIST_KEY);
        if (saved) {
          try {
            setWishlist(JSON.parse(saved));
          } catch (e) {
            console.error("Error loading from localStorage:", e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [isAuthenticated]);

  // Save wishlist to localStorage whenever it changes (for offline access)
  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const addToWishlist = async (product) => {
    // Check if product already exists
    const exists = wishlist.some((p) => (p.id || p.productId) === (product.id || product.productId));
    if (exists) {
      console.log("Product already in wishlist");
      return;
    }

    // Optimistically update UI
    const previousWishlist = [...wishlist];
    const newWishlist = [...wishlist, product];
    setWishlist(newWishlist);

    try {
      if (isAuthenticated) {
        // Save to backend API if authenticated
        await addToWishlistAPI(product);
      }
      // localStorage is already updated by useEffect
      console.log("Product added to wishlist successfully");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      // Revert on error
      setWishlist(previousWishlist);
      // Show error to user (you could add a toast notification here)
      alert("Failed to add product to wishlist. Please try again.");
    }
  };

  const removeFromWishlist = async (productId) => {
    // Optimistically update UI
    const previousWishlist = [...wishlist];
    const newWishlist = wishlist.filter((p) => (p.id || p.productId) !== productId);
    setWishlist(newWishlist);

    try {
      if (isAuthenticated) {
        // Remove from backend API if authenticated
        await removeFromWishlistAPI(productId);
      }
      // localStorage is already updated by useEffect
      console.log("Product removed from wishlist successfully");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Revert on error
      setWishlist(previousWishlist);
      alert("Failed to remove product from wishlist. Please try again.");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => (p.id || p.productId) === productId);
  };

  const clearWishlist = async () => {
    const previousWishlist = wishlist;
    setWishlist([]);
    localStorage.removeItem(WISHLIST_KEY);

    // Note: Backend doesn't have a clear all endpoint, so we remove items one by one
    if (isAuthenticated) {
      try {
        for (const product of previousWishlist) {
          await removeFromWishlistAPI(product.id || product.productId);
        }
      } catch (error) {
        console.error("Error clearing wishlist:", error);
        // Revert on error
        setWishlist(previousWishlist);
        alert("Failed to clear wishlist. Please try again.");
      }
    }
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    loading,
  };
};
