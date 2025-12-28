import { useUserHistory } from "../hooks/useUserHistory";

const PersonalizedSuggestions = ({ onSuggestionClick }) => {
  const { getRecentSearches, getPersonalizedSuggestions, searchHistory } = useUserHistory();
  const recentSearches = getRecentSearches(5);
  const personalized = getPersonalizedSuggestions();

  if (searchHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>✨</span>
        Personalized For You
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Searches</h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(item.query)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all"
                >
                  {item.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Summary */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Preferences</h4>
          <div className="space-y-2">
            {personalized.suggestedCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Top Categories:</span>
                <div className="flex gap-1">
                  {personalized.suggestedCategories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 capitalize"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {personalized.suggestedBudget && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Average Budget:</span>
                <span className="text-sm font-semibold text-purple-600">
                  ₹{personalized.suggestedBudget.toLocaleString()}
                </span>
              </div>
            )}
            {personalized.priceRange.min && personalized.priceRange.max && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Price Range:</span>
                <span className="text-sm font-semibold text-gray-700">
                  ₹{personalized.priceRange.min.toLocaleString()} - ₹{personalized.priceRange.max.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedSuggestions;
