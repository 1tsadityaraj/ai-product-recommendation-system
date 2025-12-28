/**
 * Filter products based on filter criteria
 */
export const filterProducts = (products, filters) => {
  if (!products || products.length === 0) return [];

  return products.filter((product) => {
    // Price range filter
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
      return false;
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Store filter
    if (filters.store && product.store !== filters.store) {
      return false;
    }

    // Rating filter
    if (filters.minRating && product.rating < parseFloat(filters.minRating)) {
      return false;
    }

    return true;
  });
};
