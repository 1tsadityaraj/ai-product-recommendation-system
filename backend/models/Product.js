import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  price: {
    type: Number,
    required: true,
    index: true,
  },
  originalPrice: Number,
  rating: {
    type: Number,
    default: 0,
    index: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["gaming", "coding", "student", "office"],
    index: true,
  },
  store: {
    type: String,
    enum: ["flipkart", "amazon", "local"],
    index: true,
  },
  affiliateUrl: String,
  imageUrl: String,
  inStock: {
    type: Boolean,
    default: true,
  },
  specs: {
    ram: String,
    storage: String,
    processor: String,
    graphics: String,
  },
  features: {
    performance: String,
    battery: String,
    weight: String,
    display: String,
  },
  tags: [String],
  viewCount: {
    type: Number,
    default: 0,
  },
  searchCount: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound indexes for common queries
productSchema.index({ category: 1, price: 1 });
productSchema.index({ store: 1, rating: -1 });
productSchema.index({ category: 1, rating: -1, price: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
