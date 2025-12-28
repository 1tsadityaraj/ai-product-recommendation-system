# E-Commerce Integration Guide

This application now supports integration with real e-commerce stores (Flipkart and Amazon) to fetch and recommend actual products based on user queries.

## Features

- ✅ Search products from Flipkart and Amazon
- ✅ AI-powered product matching and ranking
- ✅ Affiliate links for monetization
- ✅ Price comparison across stores
- ✅ Fallback to local product database if APIs unavailable

## Setup Instructions

### 1. Flipkart Affiliate API

1. **Sign up for Flipkart Affiliate Program**
   - Visit: https://affiliate.flipkart.com/
   - Create an account and get approved

2. **Get API Credentials**
   - Log in to your Flipkart Affiliate dashboard
   - Navigate to API section
   - Copy your Affiliate ID and Token

3. **Add to Environment Variables**
   ```bash
   FLIPKART_AFFILIATE_ID=your_affiliate_id_here
   FLIPKART_AFFILIATE_TOKEN=your_token_here
   ```

### 2. Amazon Product Advertising API

1. **Sign up for Amazon Associates Program**
   - Visit: https://affiliate-program.amazon.com/
   - Create an account and get approved

2. **Apply for Product Advertising API Access**
   - Log in to your Amazon Associates account
   - Apply for PA-API 5.0 access
   - This may require approval

3. **Get API Credentials**
   - Access Key ID
   - Secret Access Key
   - Associate Tag

4. **Add to Environment Variables**
   ```bash
   AMAZON_ACCESS_KEY=your_access_key_here
   AMAZON_SECRET_KEY=your_secret_key_here
   AMAZON_ASSOCIATE_TAG=your_associate_tag_here
   AMAZON_REGION=IN
   ```

### 3. Configure Environment Variables

1. Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   PORT=5001

   # Flipkart
   FLIPKART_AFFILIATE_ID=your_id
   FLIPKART_AFFILIATE_TOKEN=your_token

   # Amazon
   AMAZON_ACCESS_KEY=your_key
   AMAZON_SECRET_KEY=your_secret
   AMAZON_ASSOCIATE_TAG=your_tag
   AMAZON_REGION=IN
   ```

3. Restart the backend server:
   ```bash
   npm run dev
   ```

## How It Works

1. **User Query**: User enters a query like "gaming laptop under 60000"

2. **AI Processing**:
   - Extracts budget, category, and features
   - Searches both Flipkart and Amazon APIs
   - Scores products using advanced AI algorithms

3. **Results**:
   - Top 3 products with best relevance scores
   - Mix of stores for diversity
   - Includes affiliate links for monetization

4. **Fallback**: If APIs are unavailable or not configured, the system falls back to the local product database.

## Development Mode

If you don't have API credentials yet, the system will:
- Use mock product data from e-commerce stores
- Still apply AI scoring and ranking
- Show the structure for real products
- Work perfectly for development and testing

## API Structure

### Services

- **flipkartService.js**: Handles Flipkart API integration
- **amazonService.js**: Handles Amazon API integration  
- **ecommerceService.js**: Unified service that searches all stores

### Product Format

```javascript
{
  id: "product-id",
  name: "Product Name",
  price: 50000,
  originalPrice: 60000,
  rating: 4.5,
  imageUrl: "https://...",
  store: "flipkart" | "amazon" | "local",
  affiliateUrl: "https://affiliate-link",
  inStock: true,
  specs: {
    ram: "8GB",
    storage: "512GB SSD",
    processor: "Intel i5",
    graphics: "Integrated"
  },
  category: "gaming" | "coding" | "student" | "office",
  tags: ["gaming", "performance"],
  features: {
    performance: "high",
    battery: "good",
    weight: "light",
    display: "medium"
  },
  explanation: "AI-generated explanation"
}
```

## Important Notes

- **API Rate Limits**: Both Flipkart and Amazon have rate limits. The system includes error handling and fallbacks.
- **Affiliate Links**: Make sure you comply with affiliate program terms and conditions.
- **Privacy**: User queries are sent to e-commerce APIs. Ensure compliance with privacy regulations.
- **Costs**: Using these APIs may have costs or require approval. Check with each platform.

## Testing

Test the integration with queries like:
- "gaming laptop under 60000"
- "student laptop with good battery"
- "powerful laptop for coding"
- "budget laptop around 40000"
