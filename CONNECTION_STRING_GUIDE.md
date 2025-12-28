# How to Get MongoDB Atlas Connection String

## Step-by-Step Guide

### Step 1: Log in to MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Log in with your account

### Step 2: Select Your Cluster
1. You'll see your cluster(s) on the main dashboard
2. Click on the **"Connect"** button next to your cluster
   - It's a green button that says "Connect"
   - You'll see it on the cluster card

### Step 3: Choose Connection Method
1. A popup/modal will appear with connection options
2. Click on **"Connect your application"** (or "Drivers")
   - This option shows code examples for connecting
   - NOT "Connect using MongoDB Compass" or "Connect using MongoDB Shell"

### Step 4: Select Node.js Driver
1. You'll see a dropdown that says **"Driver"** or "Select a driver"
2. Choose **"Node.js"** from the dropdown
3. Select the latest version (usually the default)

### Step 5: Copy the Connection String
1. You'll see a connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
2. Click the **"Copy"** button next to the connection string
   - It's usually a small copy icon or button

### Step 6: Replace Placeholders
The connection string will have `<username>` and `<password>` placeholders. You need to:

1. **Replace `<username>`** with your actual database username
2. **Replace `<password>` with your actual database password**
   - If your password has special characters like `@`, `#`, `!`, etc., they need to be URL-encoded:
     - `@` becomes `%40`
     - `#` becomes `%23`
     - `!` becomes `%21`
     - Space becomes `%20`

3. **Add database name** after the cluster address:
   - Change: `cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - To: `cluster0.xxxxx.mongodb.net/ai-product-recommendation?retryWrites=true&w=majority`
   - (Add `/ai-product-recommendation` before the `?`)

### Example:

**Original from Atlas:**
```
mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

**After replacing (if username is "admin" and password is "MyPass@123"):**
```
mongodb+srv://admin:MyPass%40123@cluster0.abc123.mongodb.net/ai-product-recommendation?retryWrites=true&w=majority
```

**Note:** `@` in password became `%40` (URL encoding)

### Step 7: Add to .env File

1. Create/Edit `.env` file in the `backend` directory:
   ```bash
   cd backend
   nano .env  # or use any text editor
   ```

2. Add your connection string:
   ```env
   MONGODB_URI=mongodb+srv://admin:MyPass%40123@cluster0.abc123.mongodb.net/ai-product-recommendation?retryWrites=true&w=majority
   PORT=5001
   ```

3. Save the file

## Visual Guide (What You'll See)

```
MongoDB Atlas Dashboard
└── Your Cluster Card
    └── [Connect Button] ← Click here
    
        Popup Opens:
        ├── [ ] Connect using MongoDB Compass
        ├── [✓] Connect your application  ← Select this
        └── [ ] Connect using MongoDB Shell
        
            Connection Options:
            Driver: [Node.js ▼]  ← Select "Node.js"
            Version: [5.5 or later]  ← Usually default
            
            Connection String:
            ┌─────────────────────────────────────────────────────┐
            │ mongodb+srv://<username>:<password>@cluster0.xxxxx │
            │ .mongodb.net/?retryWrites=true&w=majority           │
            │                                  [📋 Copy]          │
            └─────────────────────────────────────────────────────┘
```

## Important Notes

1. **Don't share your connection string publicly** - it contains your password
2. **Make sure `.env` is in `.gitignore`** - never commit it to Git
3. **If connection fails**:
   - Double-check username and password
   - Ensure your IP is whitelisted (Network Access tab)
   - Verify the cluster is not paused

## Quick Checklist

- [ ] Logged into MongoDB Atlas
- [ ] Clicked "Connect" on your cluster
- [ ] Selected "Connect your application"
- [ ] Chose "Node.js" as driver
- [ ] Copied the connection string
- [ ] Replaced `<username>` with your username
- [ ] Replaced `<password>` with your password (URL-encoded if needed)
- [ ] Added `/ai-product-recommendation` before the `?`
- [ ] Added to `.env` file as `MONGODB_URI=...`
- [ ] Saved the `.env` file

## Alternative: Manual Construction

If you want to construct it manually:

1. Go to your cluster → "Connect" → "Connect your application"
2. Note down:
   - Your username
   - Your password (remember to URL-encode special chars)
   - Your cluster address (e.g., `cluster0.abc123.mongodb.net`)
3. Format:
   ```
   mongodb+srv://USERNAME:PASSWORD@CLUSTER_ADDRESS/ai-product-recommendation?retryWrites=true&w=majority
   ```

That's it! Your connection string is ready to use. 🚀
