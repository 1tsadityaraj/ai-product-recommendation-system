import { getAuthToken } from "./api";

const API_BASE_URL = "http://localhost:5001/api";

// Get auth token
const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Update user preferences
export const updateUserPreferences = async (preferences) => {
  const response = await fetch(`${API_BASE_URL}/user/preferences`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ preferences }),
  });

  if (!response.ok) {
    throw new Error("Failed to update preferences");
  }

  return response.json();
};

// Add search history
export const addSearchHistory = async (query, results) => {
  const response = await fetch(`${API_BASE_URL}/user/search-history`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ query, results }),
  });

  if (!response.ok) {
    throw new Error("Failed to save search history");
  }

  return response.json();
};

// Get search history
export const getSearchHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/user/search-history`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch search history");
  }

  return response.json();
};

// Get wishlist
export const getUserWishlist = async () => {
  const response = await fetch(`${API_BASE_URL}/user/wishlist`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  return response.json();
};

// Add to wishlist
export const addToWishlistAPI = async (product) => {
  const response = await fetch(`${API_BASE_URL}/user/wishlist/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ product }),
  });

  if (!response.ok) {
    throw new Error("Failed to add to wishlist");
  }

  return response.json();
};

// Remove from wishlist
export const removeFromWishlistAPI = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/user/wishlist/remove`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    throw new Error("Failed to remove from wishlist");
  }

  return response.json();
};
