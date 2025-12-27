import { useState } from "react";
import AIChatBox from "../components/AIChatBox";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Find Products Using AI
      </h1>

      <AIChatBox onRecommend={setProducts} />

      {products.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Recommended For You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
