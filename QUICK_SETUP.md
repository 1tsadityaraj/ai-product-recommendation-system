# Quick Setup - Your MongoDB Connection

## Your Connection String

Based on your MongoDB Atlas connection string:
```
mongodb+srv://ar9983239_db_user:<db_password>@cluster0.zviytyn.mongodb.net/?appName=Cluster0
```

## Steps to Configure:

### 1. Replace `<db_password>` with your actual password

**Example:** If your password is `MyPass123`, you would use:
```
mongodb+srv://ar9983239_db_user:MyPass123@cluster0.zviytyn.mongodb.net/ai-product-recommendation?appName=Cluster0
```

**Important:** If your password has special characters:
- `@` → `%40`
- `#` → `%23`
- `!` → `%21`
- `$` → `%24`
- Space → `%20`

### 2. Add database name `/ai-product-recommendation` before the `?`

Notice the change: `.mongodb.net/?appName` → `.mongodb.net/ai-product-recommendation?appName`

### 3. Add to `.env` file

Open `backend/.env` file and add:

```env
MONGODB_URI=mongodb+srv://ar9983239_db_user:YOUR_PASSWORD_HERE@cluster0.zviytyn.mongodb.net/ai-product-recommendation?appName=Cluster0
PORT=5001
```

**Replace `YOUR_PASSWORD_HERE` with your actual password!**

### 4. Test the connection

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Atlas (Cloud) Connected: cluster0.zviytyn.mongodb.net
📊 Database: ai-product-recommendation
Backend running on http://localhost:5001
```

## Quick Command (if you want to do it via terminal):

```bash
cd backend
echo 'MONGODB_URI=mongodb+srv://ar9983239_db_user:YOUR_PASSWORD@cluster0.zviytyn.mongodb.net/ai-product-recommendation?appName=Cluster0' > .env
echo 'PORT=5001' >> .env
```

**Don't forget to replace `YOUR_PASSWORD` with your actual password!**

## Don't Forget:

- ✅ Replace `<db_password>` or `YOUR_PASSWORD` with your real password
- ✅ Make sure your IP is whitelisted in MongoDB Atlas (Network Access tab)
- ✅ Never commit `.env` file to Git (it should be in .gitignore)

That's it! You're ready to connect! 🚀
