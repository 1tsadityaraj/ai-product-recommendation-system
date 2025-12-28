const API_BASE_URL = "http://localhost:5001/api";

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Create headers with authentication if token exists
const getHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Auth API calls
export const register = async (email, password, name) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
};

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
};

// AI Recommendations API
export const getAIRecommendations = async (query, userPreferences = null) => {
  const response = await fetch(`${API_BASE_URL}/ai-recommend`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ 
      query,
      userPreferences, // Include user preferences for personalization
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return response.json();
};
