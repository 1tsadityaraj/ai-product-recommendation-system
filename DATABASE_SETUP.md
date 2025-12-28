# Database Setup Guide

This application uses MongoDB to store user data, search history, preferences, and wishlists.

## Database Configuration

### MongoDB Setup Options

#### Option 1: Local MongoDB Installation

1. **Install MongoDB** (if not already installed):
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   
   # Windows
   # Download and install from https://www.mongodb.com/try/download/community
   ```

2. **Default Connection**: The app will connect to `mongodb://localhost:27017/ai-product-recommendation`

#### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create Free Account**: Go to https://www.mongodb.com/cloud/atlas
2. **Create a Cluster**: Follow the setup wizard
3. **Get Connection String**: 
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
4. **Add to .env file**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-product-recommendation
   ```

### Environment Variables

Add to your `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-product-recommendation

# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-product-recommendation
```

### Database Models

The application uses the following MongoDB collections:

1. **users** - User preferences and settings
   - userId (unique identifier)
   - preferences (categories, price range, stores, budget)

2. **searchhistories** - User search history
   - userId
   - query
   - timestamp
   - resultsCount
   - categories
   - averagePrice
   - products (array)

3. **wishlists** - User wishlists
   - userId (unique)
   - products (array of product objects)

4. **products** - Cached product data (optional)
   - productId
   - name, price, rating
   - category, store
   - specs, features
   - viewCount, searchCount

## API Endpoints

### User Management

- `POST /api/user` - Get or create user
- `POST /api/user/preferences` - Update user preferences
- `POST /api/user/search-history` - Add search to history
- `GET /api/user/search-history/:userId` - Get user search history
- `GET /api/user/wishlist/:userId` - Get user wishlist
- `POST /api/user/wishlist/add` - Add product to wishlist
- `POST /api/user/wishlist/remove` - Remove product from wishlist

## Testing the Database

1. **Start MongoDB** (if using local):
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu
   sudo systemctl start mongodb
   ```

2. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Check connection**: You should see "✅ MongoDB Connected" in the console

## Migration from LocalStorage

The frontend currently uses localStorage. To migrate to database:

1. Generate a userId for each user (or use browser fingerprint)
2. On first load, create user in database
3. Sync localStorage data to database
4. Use database APIs instead of localStorage

## Troubleshooting

### Connection Issues

- **Error: "ECONNREFUSED"**: MongoDB is not running
  - Start MongoDB service
  - Check if port 27017 is available

- **Error: "Authentication failed"**: Wrong credentials (Atlas)
  - Check username/password in connection string
  - Ensure IP is whitelisted in Atlas

- **Error: "Server selection timed out"**: Network/firewall issue
  - Check firewall settings
  - For Atlas, ensure IP whitelist includes your IP

### Database Not Found

MongoDB will automatically create the database on first write operation. No manual creation needed.

## Production Considerations

1. **Use MongoDB Atlas** for production (managed, scalable)
2. **Enable authentication** in MongoDB
3. **Use connection pooling** (Mongoose handles this)
4. **Set up indexes** (already configured in models)
5. **Regular backups** of user data
6. **Monitor connection health** and implement retry logic
