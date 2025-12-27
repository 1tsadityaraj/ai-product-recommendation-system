const API_BASE_URL = "http://localhost:5001/api";

export const getAIRecommendations = async (query) => {
  const response = await fetch(`${API_BASE_URL}/ai-recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return response.json();
};
