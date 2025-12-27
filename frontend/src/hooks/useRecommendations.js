import { useState } from "react";

const useRecommendations = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  return {
    products,
    setProducts,
    loading,
    setLoading,
  };
};

export default useRecommendations;
