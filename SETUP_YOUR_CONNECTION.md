# Setup Your MongoDB Connection String

You have your connection string! Here's how to configure it properly:

## Your Connection String (from MongoDB Atlas)

```
mongodb+srv://ar9983239_db_user:<db_password>@cluster0.zviytyn.mongodb.net/?appName=Cluster0
```

## What You Need to Do:

### Step 1: Replace the Password

Replace `<db_password>` with your actual MongoDB database password.

**If your password is:** `MyPassword123`

**The connection string becomes:**
```
mongodb+srv://ar9983239_db_user:MyPassword123@cluster0.zviytyn.mongodb.net/?appName=Cluster0
```

**⚠️ Important:** If your password contains special characters, they need to be URL-encoded:
- `@` → `%40`
- `#` → `%23`
- `!` → `%21`
- `$` → `%24`
- Space → `%20`

Example: If password is `Pass@123`, use `Pass%40123`

### Step 2: Add Database Name

Add `/ai-product-recommendation` before the `?`:

**Change from:**
```
mongodb+srv://ar9983239_db_user:YOUR_PASSWORD@cluster0.zviytyn.mongodb.net/?appName=Cluster0
```

**To:**
```
mongodb+srv://ar9983239_db_user:YOUR_PASSWORD@cluster0.zviytyn.mongodb.net/ai-product-recommendation?appName=Cluster0
```

### Step 3: Create/Update .env File

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create or edit `.env` file:
   ```bash
   # macOS/Linux
   nano .env
   
   # Or use any text editor
   ```

3. Add this content (replace `YOUR_ACTUAL_PASSWORD` with your real password):
   ```env
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://ar9983239_db_user:YOUR_ACTUAL_PASSWORD@cluster0.zviytyn.mongodb.net/ai-product-recommendation?appName=Cluster0
   
   # Server Port
   PORT=5001
   ```

4. Save the file (Ctrl+X, then Y, then Enter for nano)

### Step 4: Test Connection

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   ✅ MongoDB Atlas (Cloud) Connected: cluster0.zviytyn.mongodb.net
   📊 Database: ai-product-recommendation
   Backend running on http://localhost:5001
   ```

## Complete Example

If your password is `MySecurePass123`, your `.env` file should look like:

```env
MONGODB_URI=mongodb+srv://ar9983239_db_user:MySecurePass123@cluster0.zviytyn.mongodb.net/ai-product-recommendation?appName=Cluster0
PORT=5001
```

If your password is `Pass@2024`, your `.env` file should look like:

```env
MONGODB_URI=mongodb+srv://ar9983239_db_user:Pass%402024@cluster0.zviytyn.mongodb.net/ai-product-recommendation?appName=Cluster0
PORT=5001
```

## Troubleshooting

### Error: "Authentication failed"
- Double-check your password
- Make sure you replaced `<db_password>` with your actual password
- URL-encode any special characters in password

### Error: "IP not whitelisted"
- Go to MongoDB Atlas → Network Access
- Click "Add IP Address"
- Click "Add My Current IP Address" or use "Allow Access from Anywhere" (0.0.0.0/0) for development

### Connection works but database not found
- The database `ai-product-recommendation` will be created automatically on first use
- This is normal and expected

## Security Reminder

⚠️ **Never commit `.env` file to Git!**

Make sure your `.gitignore` includes:
```
.env
.env.local
.env*.local
```

Your connection is almost ready! Just replace the password and you're good to go! 🚀
