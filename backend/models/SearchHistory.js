import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  query: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  resultsCount: {
    type: Number,
    default: 0,
  },
  categories: {
    type: Map,
    of: Number,
    default: {},
  },
  averagePrice: {
    type: Number,
    default: null,
  },
  products: [{
    productId: String,
    name: String,
    price: Number,
    category: String,
    store: String,
  }],
});

// Index for efficient queries
searchHistorySchema.index({ userId: 1, timestamp: -1 });

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;
