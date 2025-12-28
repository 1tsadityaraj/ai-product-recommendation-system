import axios from "axios";

/**
 * Flipkart Affiliate API Service
 * 
 * Note: To use this service, you need to:
 * 1. Sign up for Flipkart Affiliate Program: https://affiliate.flipkart.com/
 * 2. Get your API credentials (Affiliate ID and Token)
 * 3. Add them to your .env file:
 *    FLIPKART_AFFILIATE_ID=your_affiliate_id
 *    FLIPKART_AFFILIATE_TOKEN=your_token
 */

const FLIPKART_AFFILIATE_ID = process.env.FLIPKART_AFFILIATE_ID || "";
const FLIPKART_AFFILIATE_TOKEN = process.env.FLIPKART_AFFILIATE_TOKEN || "";
const FLIPKART_API_BASE = "https://affiliate-api.flipkart.net/affiliate/api";

/**
 * Search for laptops on Flipkart based on query
 * @param {string} searchQuery - Search query for laptops
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of product objects
 */
export async function searchFlipkartProducts(searchQuery, limit = 10) {
  try {
    // If no credentials, return mock data structure for development
    if (!FLIPKART_AFFILIATE_ID || !FLIPKART_AFFILIATE_TOKEN) {
      console.warn("Flipkart credentials not configured. Using mock data.");
      return getMockFlipkartProducts(searchQuery, limit);
    }

    // Construct search query for Flipkart
    const query = `laptops ${searchQuery}`.trim();
    const encodedQuery = encodeURIComponent(query);
    
    // Flipkart Affiliate API endpoint
    const url = `${FLIPKART_API_BASE}/flipkart/product/search?query=${encodedQuery}&resultCount=${limit}`;
    
    const response = await axios.get(url, {
      headers: {
        'Fk-Affiliate-Id': FLIPKART_AFFILIATE_ID,
        'Fk-Affiliate-Token': FLIPKART_AFFILIATE_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    // Transform Flipkart API response to our product format
    return transformFlipkartProducts(response.data);
  } catch (error) {
    console.error("Error fetching Flipkart products:", error.message);
    // Fallback to mock data on error
    return getMockFlipkartProducts(searchQuery, limit);
  }
}

/**
 * Transform Flipkart API response to our product format
 */
function transformFlipkartProducts(apiResponse) {
  if (!apiResponse || !apiResponse.products || !Array.isArray(apiResponse.products)) {
    return [];
  }

  return apiResponse.products.map((product) => ({
    id: product.productId,
    name: product.productBaseInfoV1?.title || "Laptop",
    price: parseFloat(product.productBaseInfoV1?.flipkartSellingPrice?.amount || 0),
    originalPrice: parseFloat(product.productBaseInfoV1?.flipkartSpecialPrice?.amount || 0),
    rating: parseFloat(product.productBaseInfoV1?.productRating || 0),
    imageUrl: product.productBaseInfoV1?.imageUrls?.[0]?.url || "",
    store: "flipkart",
    affiliateUrl: product.productBaseInfoV1?.productUrl || "",
    inStock: product.productBaseInfoV1?.inStock || false,
    // Extract specs from product specifications
    specs: extractSpecsFromFlipkart(product.productBaseInfoV1?.productSpecifications || []),
    category: detectCategoryFromProduct(product.productBaseInfoV1?.title || ""),
    tags: extractTagsFromProduct(product.productBaseInfoV1?.title || ""),
    features: extractFeaturesFromSpecs(product.productBaseInfoV1?.productSpecifications || [])
  }));
}

/**
 * Extract specifications from Flipkart product data
 */
function extractSpecsFromFlipkart(specifications) {
  const specs = {};
  const specMap = {
    'RAM': 'ram',
    'Storage': 'storage',
    'Processor': 'processor',
    'Graphics': 'graphics',
    'Processor Name': 'processor',
    'RAM Capacity': 'ram',
    'Hard Drive Capacity': 'storage'
  };

  specifications.forEach(spec => {
    if (spec.values && spec.values.length > 0) {
      const key = specMap[spec.key] || spec.key.toLowerCase();
      specs[key] = spec.values[0].value || spec.values[0];
    }
  });

  return specs;
}

/**
 * Detect category from product title
 */
function detectCategoryFromProduct(title) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('gaming') || lowerTitle.includes('rbg')) return 'gaming';
  if (lowerTitle.includes('business') || lowerTitle.includes('office')) return 'office';
  if (lowerTitle.includes('student') || lowerTitle.includes('education')) return 'student';
  if (lowerTitle.includes('developer') || lowerTitle.includes('workstation')) return 'coding';
  return 'office';
}

/**
 * Extract tags from product
 */
function extractTagsFromProduct(title) {
  const tags = [];
  const titleLower = title.toLowerCase();
  const keywords = ['gaming', 'business', 'student', 'portable', 'lightweight', 'powerful', 'budget'];
  keywords.forEach(keyword => {
    if (titleLower.includes(keyword)) tags.push(keyword);
  });
  return tags;
}

/**
 * Extract features from specifications
 */
function extractFeaturesFromSpecs(specifications) {
  const features = {
    performance: 'medium',
    battery: 'medium',
    weight: 'medium',
    display: 'medium'
  };

  specifications.forEach(spec => {
    const value = spec.values?.[0]?.value?.toLowerCase() || '';
    if (value.includes('16gb') || value.includes('32gb') || value.includes('i7') || value.includes('ryzen 7')) {
      features.performance = 'high';
    }
    if (value.includes('lightweight') || value.includes('thin') || value.includes('ultrabook')) {
      features.weight = 'light';
    }
  });

  return features;
}

/**
 * Mock Flipkart products for development/demo
 */
function getMockFlipkartProducts(query, limit) {
  // These are example product structures - replace with real API data
  // Use search links as fallback so users can still click through
  const searchQuery = query || "laptop";
  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;
  
  const mockProducts = [
    {
      id: "fk-laptop-1",
      name: "ASUS VivoBook 15",
      price: 45000,
      originalPrice: 52000,
      rating: 4.2,
      imageUrl: "https://via.placeholder.com/300",
      store: "flipkart",
      affiliateUrl: searchUrl,
      isSearchLink: true, // Indicates this is a search page, not direct product
      inStock: true,
      specs: {
        ram: "8GB DDR4",
        storage: "512GB SSD",
        processor: "Intel Core i5 11th Gen",
        graphics: "Integrated Intel UHD"
      },
      category: "student",
      tags: ["student", "budget", "portable"],
      features: {
        performance: "medium",
        battery: "good",
        weight: "light",
        display: "medium"
      }
    },
    {
      id: "fk-laptop-2",
      name: "HP Pavilion Gaming",
      price: 65000,
      originalPrice: 72000,
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/300",
      store: "flipkart",
      affiliateUrl: searchUrl,
      isSearchLink: true, // Indicates this is a search page, not direct product
      inStock: true,
      specs: {
        ram: "16GB DDR4",
        storage: "512GB SSD",
        processor: "AMD Ryzen 7",
        graphics: "NVIDIA GTX 1650"
      },
      category: "gaming",
      tags: ["gaming", "performance", "graphics"],
      features: {
        performance: "high",
        battery: "medium",
        weight: "heavy",
        display: "high"
      }
    }
  ];

  return mockProducts.slice(0, limit);
}

/**
 * Get product details by ID
 */
export async function getFlipkartProductDetails(productId) {
  try {
    if (!FLIPKART_AFFILIATE_ID || !FLIPKART_AFFILIATE_TOKEN) {
      return null;
    }

    const url = `${FLIPKART_API_BASE}/flipkart/product/${productId}`;
    const response = await axios.get(url, {
      headers: {
        'Fk-Affiliate-Id': FLIPKART_AFFILIATE_ID,
        'Fk-Affiliate-Token': FLIPKART_AFFILIATE_TOKEN
      }
    });

    return transformFlipkartProducts({ products: [response.data] })[0];
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    return null;
  }
}
