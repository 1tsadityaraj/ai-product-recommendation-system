import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  products: [{
    productId: {
      type: String,
      required: true,
    },
    name: String,
    price: Number,
    rating: Number,
    category: String,
    store: String,
    affiliateUrl: String,
    specs: mongoose.Schema.Types.Mixed,
    features: mongoose.Schema.Types.Mixed,
    imageUrl: String,
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
wishlistSchema.index({ userId: 1 });

// Ensure one wishlist per user
wishlistSchema.index({ userId: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
