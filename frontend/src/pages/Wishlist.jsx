import { useWishlist } from "../hooks/useWishlist";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist, isInWishlist } = useWishlist();

  const handleToggleWishlist = (product) => {
    removeFromWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-gray-600 mt-2">
              {wishlist.length} product{wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product, index) => (
            <ProductCard
              key={product.id || index}
              product={product}
              index={index}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist(product.id)}
              showComparison={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <div className="text-6xl mb-4">❤️</div>
          <p className="text-gray-500 text-lg mb-2">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm">
            Start adding products to your wishlist by clicking the heart icon
          </p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
