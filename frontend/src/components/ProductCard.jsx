import formatPrice from "../utils/formatPrice";

const ProductCard = ({ product, index = 0, onAddToCompare, onToggleWishlist, isInWishlist = false, showComparison = false }) => {
  const getCategoryColor = (category) => {
    const colors = {
      gaming: "from-red-500 to-pink-500",
      coding: "from-blue-500 to-cyan-500",
      student: "from-green-500 to-emerald-500",
      office: "from-purple-500 to-indigo-500",
    };
    return colors[category] || "from-gray-500 to-gray-600";
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      gaming: "🎮",
      coding: "💻",
      student: "📚",
      office: "💼",
    };
    return emojis[category] || "📦";
  };

  const category = product.category || "default";
  const gradientColor = getCategoryColor(category);
  const categoryEmoji = getCategoryEmoji(category);

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden relative group"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Gradient Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColor}`}></div>
      
      {/* Category Badge */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2 rounded-full transition-all ${
              isInWishlist
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-600"
            } shadow-md`}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isInWishlist ? "❤️" : "🤍"}
          </button>
        )}
        {/* Compare Button */}
        {showComparison && onAddToCompare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCompare(product);
            }}
            className="p-2 bg-white/80 text-gray-600 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-all shadow-md"
            title="Add to comparison"
          >
            ⚖️
          </button>
        )}
        <span className="text-2xl animate-pulse-slow">{categoryEmoji}</span>
      </div>

      {/* Product Content */}
      <div className="mt-2">
        <h3 className="font-bold text-xl text-gray-800 mb-3 pr-8 group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <p className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </p>
                <span className="text-sm font-semibold text-green-600">
                  ({Math.round((1 - product.price / product.originalPrice) * 100)}% off)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <span className="text-yellow-400 text-xl">⭐</span>
            <span className="ml-1 font-semibold text-gray-700">{product.rating}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-500 capitalize">{category}</span>
        </div>

        {/* Specs */}
        {product.specs && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {product.specs.ram && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">RAM:</span>
                  <span className="font-semibold text-gray-700">{product.specs.ram}</span>
                </div>
              )}
              {product.specs.storage && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Storage:</span>
                  <span className="font-semibold text-gray-700">{product.specs.storage}</span>
                </div>
              )}
              {product.specs.processor && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">CPU:</span>
                  <span className="font-semibold text-gray-700">{product.specs.processor}</span>
                </div>
              )}
              {product.specs.graphics && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">GPU:</span>
                  <span className="font-semibold text-gray-700">{product.specs.graphics}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Explanation */}
        {product.explanation && (
          <div className="mb-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
            <p className="text-xs text-purple-800 leading-relaxed">
              <span className="font-semibold">💡 AI Insight: </span>
              {product.explanation}
            </p>
          </div>
        )}

        {/* Store Badge */}
        {product.store && product.store !== "local" && (
          <div className="mt-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                product.store === "flipkart" 
                  ? "bg-blue-100 text-blue-800 border border-blue-200" 
                  : product.store === "amazon"
                  ? "bg-orange-100 text-orange-800 border border-orange-200"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {product.store === "flipkart" ? "🛒 Flipkart" : product.store === "amazon" ? "📦 Amazon" : product.store}
              </span>
              {product.isSearchLink && (
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  Search Link
                </span>
              )}
              {!product.affiliateUrl && product.store !== "local" && (
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
                  API Required
                </span>
              )}
              {product.originalPrice && product.price < product.originalPrice && (
                <span className="text-xs text-green-600 font-semibold">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Details / Buy Now Button */}
        {product.affiliateUrl && product.affiliateUrl !== "#" && product.affiliateUrl !== null ? (
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg text-center block"
          >
            {product.isSearchLink 
              ? `Search on ${product.store === "flipkart" ? "Flipkart" : product.store === "amazon" ? "Amazon" : "Store"}`
              : `Buy on ${product.store === "flipkart" ? "Flipkart" : product.store === "amazon" ? "Amazon" : "Store"}`
            }
          </a>
        ) : (
          <div className="mt-2 space-y-2">
            <button 
              disabled
              className="w-full py-2.5 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed shadow-md"
            >
              {product.store === "local" ? "Demo Product" : "No Link Available"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
  