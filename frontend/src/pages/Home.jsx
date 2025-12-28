import { useState, useEffect } from "react";
import AIChatBox from "../components/AIChatBox";
import ProductCard from "../components/ProductCard";
import ProductComparison from "../components/ProductComparison";
import ProductFilters from "../components/ProductFilters";
import PersonalizedSuggestions from "../components/PersonalizedSuggestions";
import { useWishlist } from "../hooks/useWishlist";
import { useUserHistory } from "../hooks/useUserHistory";
import { filterProducts } from "../utils/filterProducts";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { 
    addToHistory, 
    getRecentSearches, 
    getPersonalizedSuggestions, 
    searchHistory, 
    userPreferences 
  } = useUserHistory();

  // Update filtered products when products or filters change
  useEffect(() => {
    if (Object.keys(filters).length === 0 || Object.values(filters).every(v => !v)) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(filterProducts(products, filters));
    }
  }, [products, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (Object.keys(newFilters).length === 0 || Object.values(newFilters).every(v => !v)) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(filterProducts(products, newFilters));
    }
  };

  const handleAddToCompare = (product) => {
    setComparisonProducts((prev) => {
      // Check if product already exists
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev;
      // Limit to 3 products for comparison
      if (prev.length >= 3) {
        alert("You can compare up to 3 products at a time");
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromCompare = (productId) => {
    setComparisonProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleToggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Find Products Using AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Describe what you're looking for and let our AI find the perfect products for you
        </p>
      </div>

      {/* Personalized Suggestions */}
      {searchHistory.length > 0 && (
        <div className="max-w-3xl mx-auto mb-6">
          <PersonalizedSuggestions 
            onSuggestionClick={(query) => {
              // Trigger search with suggested query
              setCurrentQuery(query);
            }}
          />
        </div>
      )}

      {/* AI Chat Box */}
      <div className="max-w-3xl mx-auto mb-12">
        <AIChatBox 
          onRecommend={(newProducts) => {
            setProducts(newProducts);
          }}
          onQueryChange={setCurrentQuery}
          onSearchComplete={(query, results) => {
            addToHistory(query, results);
          }}
          userPreferences={userPreferences}
          initialQuery={currentQuery}
        />
      </div>

      {/* Comparison and Filters Section */}
      {products.length > 0 && (
        <div className="mb-8 flex flex-col md:flex-row gap-6">
          {/* Filters */}
          <div className="md:w-1/4">
            <ProductFilters onFilterChange={handleFilterChange} currentFilters={filters} />
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {displayProducts.length} Product{displayProducts.length !== 1 ? "s" : ""} Found
                </h2>
                {comparisonProducts.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {comparisonProducts.length} product{comparisonProducts.length !== 1 ? "s" : ""} in comparison
                  </p>
                )}
              </div>
              {comparisonProducts.length > 0 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
                >
                  ⚖️ Compare ({comparisonProducts.length})
                </button>
              )}
            </div>

            {/* Products Grid */}
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {displayProducts.map((product, index) => (
                  <ProductCard
                    key={product.id || index}
                    product={product}
                    index={index}
                    onAddToCompare={handleAddToCompare}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={isInWishlist(product.id)}
                    showComparison={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <p className="text-gray-500 text-lg">
                  No products match your filters. Try adjusting your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 animate-float">🔍</div>
          <p className="text-gray-500 text-lg">
            Ask me anything to get started!
          </p>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <ProductComparison
          products={comparisonProducts}
          onClose={() => setShowComparison(false)}
          onRemove={handleRemoveFromCompare}
        />
      )}
    </div>
  );
};

export default Home;