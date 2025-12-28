import { useState, useEffect } from "react";
import AIChatBox from "../components/AIChatBox";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stores, setStores] = useState(null);
  const [filters, setFilters] = useState({});

  // Apply filters whenever products or filters change
  useEffect(() => {
    let updated = [...products];

    if (filters.category) {
      updated = updated.filter(
        (p) => p.category === filters.category
      );
    }

    if (filters.maxPrice) {
      updated = updated.filter(
        (p) => p.price <= filters.maxPrice
      );
    }

    setFilteredProducts(updated);
  }, [products, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI Product Recommendation System
      </h1>

      {/* AI Search Box */}
      <AIChatBox
        onRecommend={(data) => {
          setProducts(data.recommendations || []);
          setStores(data.stores || null);
        }}
      />

      {/* Recommendations Section */}
      {products.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            Recommended For You
          </h2>

          {/* Store Links */}
          {stores && (
            <div className="flex justify-center gap-4 mb-6">
              <a
                href={stores.amazon}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold"
              >
                View on Amazon
              </a>

              <a
                href={stores.flipkart}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold"
              >
                View on Flipkart
              </a>
            </div>
          )}

          {/* Filters + Product Grid */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters */}
            <div className="md:w-1/4">
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
              />
            </div>

            {/* Products */}
            <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  No products match the selected filters.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
