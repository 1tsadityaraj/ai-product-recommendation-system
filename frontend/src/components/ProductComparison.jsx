import { useState } from "react";
import formatPrice from "../utils/formatPrice";

const ProductComparison = ({ products, onClose, onRemove }) => {
  if (!products || products.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
          <p className="text-center text-gray-500">No products to compare</p>
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Get all unique keys from all products for comparison table
  const getComparisonFields = () => {
    const fields = [
      { key: "name", label: "Product Name", type: "text" },
      { key: "price", label: "Price", type: "price" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "store", label: "Store", type: "badge" },
      { key: "specs.ram", label: "RAM", type: "text" },
      { key: "specs.storage", label: "Storage", type: "text" },
      { key: "specs.processor", label: "Processor", type: "text" },
      { key: "specs.graphics", label: "Graphics", type: "text" },
      { key: "category", label: "Category", type: "badge" },
    ];

    return fields;
  };

  const getFieldValue = (product, fieldKey) => {
    const keys = fieldKey.split(".");
    let value = product;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return "—";
    }
    return value || "—";
  };

  const fields = getComparisonFields();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Compare Products
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                  Feature
                </th>
                {products.map((product, index) => (
                  <th
                    key={product.id || index}
                    className="border border-gray-200 p-4 text-center min-w-[200px] relative"
                  >
                    {onRemove && (
                      <button
                        onClick={() => onRemove(product.id || index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                        title="Remove from comparison"
                      >
                        ×
                      </button>
                    )}
                    <div className="font-semibold text-gray-800 mb-2">
                      {product.name}
                    </div>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-24 h-24 object-contain mx-auto rounded"
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.key} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-4 font-semibold text-gray-700 sticky left-0 bg-white z-10">
                    {field.label}
                  </td>
                  {products.map((product, index) => {
                    const value = getFieldValue(product, field.key);
                    return (
                      <td
                        key={product.id || index}
                        className="border border-gray-200 p-4 text-center"
                      >
                        {field.type === "price" && value !== "—" ? (
                          <span className="font-bold text-purple-600">
                            {formatPrice(value)}
                          </span>
                        ) : field.type === "rating" && value !== "—" ? (
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ) : field.type === "badge" && value !== "—" ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              value === "flipkart"
                                ? "bg-blue-100 text-blue-800"
                                : value === "amazon"
                                ? "bg-orange-100 text-orange-800"
                                : value === "gaming"
                                ? "bg-red-100 text-red-800"
                                : value === "coding"
                                ? "bg-blue-100 text-blue-800"
                                : value === "student"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {value}
                          </span>
                        ) : (
                          <span className="text-gray-600">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Close
          </button>
          {products[0]?.affiliateUrl && (
            <a
              href={products[0].affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition text-center"
            >
              View Best Deal
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
