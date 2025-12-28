import { useState, useEffect } from "react";
import { getAIRecommendations } from "../services/api";
import Loader from "./Loader";

const AIChatBox = ({ onRecommend, onQueryChange, onSearchComplete, userPreferences = null, initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);

  const handleAskAIWithQuery = async (queryToUse) => {
    if (!queryToUse.trim()) return;

    onRecommend([]); // clear old results
    if (onQueryChange) onQueryChange(queryToUse); // Notify parent of query change

    try {
      setLoading(true);
      const data = await getAIRecommendations(queryToUse, userPreferences);
      onRecommend(data);
      if (onSearchComplete) onSearchComplete(queryToUse, data); // Notify parent of completed search
    } catch (error) {
      alert("AI service failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = () => {
    if (!query.trim()) return;
    handleAskAIWithQuery(query);
  };

  // Update query when initialQuery prop changes (for personalized suggestions)
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
      // Auto-trigger search if query is provided
      if (initialQuery.trim()) {
        handleAskAIWithQuery(initialQuery);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl animate-pulse-slow">✨</div>
        <h3 className="text-xl font-bold text-gray-800">
          What are you looking for?
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            className="w-full border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 p-4 rounded-xl text-lg transition-all duration-200 bg-white/90 focus:bg-white outline-none placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., gaming laptop under ₹50,000"
            disabled={loading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
        <button
          onClick={handleAskAI}
          disabled={loading || !query.trim()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Searching...
            </>
          ) : (
            <>
              <span>🚀</span>
              Ask AI
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="mt-4">
          <Loader />
        </div>
      )}

      {/* Example queries or Personalized suggestions */}
      {!loading && query.length === 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {userPreferences && Object.keys(userPreferences.preferredCategories || {}).length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-2">✨ Based on your history:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(userPreferences.preferredCategories || {})
                  .slice(0, 3)
                  .map((category) => (
                    <button
                      key={category}
                      onClick={() => setQuery(`${category} laptop`)}
                      className="text-xs bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-full text-purple-700 transition-colors font-medium"
                    >
                      {category} laptop
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {["gaming laptop", "student laptop under 50000", "coding laptop", "office laptop"].map((example) => (
                  <button
                    key={example}
                    onClick={() => setQuery(example)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-700 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIChatBox;


