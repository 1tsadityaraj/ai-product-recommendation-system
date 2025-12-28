import { useState } from "react";

const ProductFilters = ({ onFilterChange, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    minPrice: currentFilters.minPrice || "",
    maxPrice: currentFilters.maxPrice || "",
    category: currentFilters.category || "",
    store: currentFilters.store || "",
    minRating: currentFilters.minRating || "",
    ...currentFilters,
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: "",
      maxPrice: "",
      category: "",
      store: "",
      minRating: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">🔍 Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price Range (₹)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="gaming">🎮 Gaming</option>
            <option value="coding">💻 Coding</option>
            <option value="student">📚 Student</option>
            <option value="office">💼 Office</option>
          </select>
        </div>

        {/* Store */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Store
          </label>
          <select
            value={filters.store}
            onChange={(e) => handleFilterChange("store", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Stores</option>
            <option value="flipkart">🛒 Flipkart</option>
            <option value="amazon">📦 Amazon</option>
            <option value="local">🏠 Local</option>
          </select>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Rating
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleFilterChange("minRating", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Any Rating</option>
            <option value="4.5">⭐ 4.5+ (Excellent)</option>
            <option value="4.0">⭐ 4.0+ (Very Good)</option>
            <option value="3.5">⭐ 3.5+ (Good)</option>
            <option value="3.0">⭐ 3.0+ (Average)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
