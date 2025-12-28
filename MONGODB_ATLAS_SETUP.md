# MongoDB Atlas Setup Guide (Online MongoDB)

MongoDB Atlas is a cloud-hosted MongoDB service. This guide will help you set it up for this application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign Up"
3. Create an account (you can use Google, GitHub, or email)

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **FREE (M0)** tier (perfect for development)
3. Select your **Cloud Provider and Region**:
   - Choose the region closest to you
   - Recommended: AWS (most reliable)
   - Select a region like `Mumbai (ap-south-1)` for India or `N. Virginia (us-east-1)` for US
4. Click **"Create"**
5. Wait 1-3 minutes for cluster to be created

## Step 3: Create Database User

1. You'll see a security setup screen
2. **Username**: Create a username (e.g., `admin` or `aiproductuser`)
3. **Password**: Create a strong password (save it securely!)
4. Click **"Create Database User"**

## Step 4: Network Access (Whitelist IP)

1. In the security setup, you'll see "Where would you like to connect from?"
2. For development, click **"Add My Current IP Address"**
3. For production/all access, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ **Warning**: Only use this for development/testing, not production
4. Click **"Finish and Close"**

## Step 5: Get Connection String

### Detailed Steps:

1. **Click "Connect" button** on your cluster (green button on the cluster card)
2. **Select "Connect your application"** (NOT Compass or Shell)
3. **Choose "Node.js"** from the Driver dropdown
4. **Copy the connection string** - it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Important**: Replace `<username>` and `<password>` with your actual credentials
6. **Add database name**: Insert `/ai-product-recommendation` before the `?` in the connection string

**Visual Guide:**
- Cluster Card → [Connect Button] → "Connect your application" → Driver: "Node.js" → [Copy Button]

**See [CONNECTION_STRING_GUIDE.md](./CONNECTION_STRING_GUIDE.md) for detailed visual instructions**

## Step 6: Configure Your Application

1. Create/update `.env` file in the `backend` directory:
   ```bash
   cd backend
   touch .env  # if file doesn't exist
   ```

2. Add your MongoDB Atlas connection string:
   ```env
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/ai-product-recommendation?retryWrites=true&w=majority
   
   # Server Port
   PORT=5001
   
   # Optional: E-commerce API keys (if you have them)
   # FLIPKART_AFFILIATE_ID=your_id
   # FLIPKART_AFFILIATE_TOKEN=your_token
   # AMAZON_ACCESS_KEY=your_key
   # AMAZON_SECRET_KEY=your_secret
   # AMAZON_ASSOCIATE_TAG=your_tag
   # AMAZON_REGION=IN
   ```

3. **Important Points**:
   - Replace `your-username` with your database username
   - Replace `your-password` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster address
   - The database name `ai-product-recommendation` will be created automatically
   - Make sure there are no spaces or quotes around the connection string

## Step 7: Test Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   ✅ MongoDB Atlas (Cloud) Connected: cluster0.xxxxx.mongodb.net
   📊 Database: ai-product-recommendation
   Backend running on http://localhost:5001
   ```

3. If you see an error, check:
   - ✅ Username and password are correct
   - ✅ IP address is whitelisted
   - ✅ Connection string format is correct
   - ✅ Internet connection is active

## Example .env File

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://admin:MySecurePassword123@cluster0.abc123.mongodb.net/ai-product-recommendation?retryWrites=true&w=majority

# Server Configuration
PORT=5001
```

## Troubleshooting

### Error: "Authentication failed"
- **Solution**: Double-check your username and password
- Make sure special characters in password are URL-encoded (e.g., `@` becomes `%40`)

### Error: "IP not whitelisted"
- **Solution**: Go to MongoDB Atlas → Network Access → Add IP Address
- For development, you can temporarily use `0.0.0.0/0` (allows all IPs)

### Error: "MongoServerError: bad auth"
- **Solution**: Verify your username and password match exactly
- Check if your database user has proper permissions

### Connection Timeout
- **Solution**: 
  - Check your internet connection
  - Verify the cluster is running (not paused)
  - Check if your firewall is blocking the connection

### Database Name Issues
- The database name in the connection string is optional
- MongoDB Atlas will create it automatically on first write
- You can also specify it: `mongodb+srv://.../ai-product-recommendation`

## Security Best Practices

1. **Never commit `.env` file to Git**
   - Make sure `.env` is in your `.gitignore`

2. **Use Strong Passwords**
   - Mix of uppercase, lowercase, numbers, and special characters

3. **Limit IP Access**
   - For production, only whitelist specific IP addresses
   - Avoid using `0.0.0.0/0` in production

4. **Use Environment Variables**
   - Never hardcode connection strings in code
   - Always use environment variables

## MongoDB Atlas Free Tier Limits

- **Storage**: 512 MB (enough for development/testing)
- **RAM**: Shared (sufficient for small applications)
- **Connections**: 500 concurrent connections
- **Free Forever**: Yes, with these limits

## Next Steps

Once connected:
1. ✅ Your data will be stored in the cloud
2. ✅ Accessible from anywhere
3. ✅ Automatic backups included
4. ✅ No local MongoDB installation needed

Your application is now ready to use MongoDB Atlas! 🚀
