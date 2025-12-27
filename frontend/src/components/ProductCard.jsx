const ProductCard = ({ product }) => {
    return (
      <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
        <h3 className="font-semibold text-lg">
          {product.name}
        </h3>
        <p className="text-gray-600 mt-1">
          ₹{product.price}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          ⭐ {product.rating}
        </p>
      </div>
    );
  };
  
  export default ProductCard;
  