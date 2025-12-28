# User Authentication Setup

## Overview

User authentication has been added to the AI Product Recommendation System. Users can now register, login, and have their data (preferences, search history, wishlist) linked to their accounts.

## Features

✅ **User Registration** - Create account with email and password  
✅ **User Login** - Secure authentication with JWT tokens  
✅ **Protected Routes** - User data is protected and requires authentication  
✅ **Profile Management** - Users can view their profile  
✅ **Data Persistence** - All user data is stored in MongoDB Atlas  

## Backend Setup

### 1. Environment Variables

Add the following to your `backend/.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

**Important:** Change `JWT_SECRET` to a secure random string in production!

### 2. New Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires authentication)

### 3. Protected User Routes

All user data endpoints now support authentication:
- `/api/user/preferences` - Update preferences
- `/api/user/search-history` - Get/add search history
- `/api/user/wishlist` - Get/manage wishlist

## Frontend Setup

### 1. Login/Register Page

Navigate to `/login` to:
- Register a new account
- Login with existing credentials
- Continue as guest (limited functionality)

### 2. Authentication Context

The app uses `AuthContext` to manage:
- User state
- Authentication tokens
- Login/logout functions

### 3. Protected Features

When logged in, users get:
- ✅ Personalized recommendations based on history
- ✅ Persistent wishlist across devices
- ✅ Search history tracking
- ✅ User preferences synced to database

## User Model

Users are stored with:
- Email (unique, required)
- Password (hashed with bcrypt)
- Name (optional)
- Preferences (categories, price range, stores, budget)
- userId (unique identifier string)

## Security Features

- ✅ Passwords are hashed using bcrypt
- ✅ JWT tokens for secure authentication
- ✅ Passwords excluded from API responses
- ✅ Token expiration (7 days default)

## Usage

### Register

```javascript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

### Login

```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {...}
  }
}
```

### Authenticated Requests

Include the token in the Authorization header:

```javascript
Authorization: Bearer <jwt-token>
```

## Migration Notes

- Existing local storage data will continue to work for guest users
- To sync data with account, users should login
- User data is automatically linked to authenticated sessions
- Search history and preferences are saved to MongoDB when authenticated

## Testing

1. Start the backend server
2. Navigate to `http://localhost:5173/login`
3. Register a new account or login
4. Search for products - your history will be saved
5. Add products to wishlist - they'll persist across sessions
6. View personalized suggestions based on your search history

## Troubleshooting

**"JWT_SECRET is not set"**
- Add `JWT_SECRET` to your `backend/.env` file

**"Authentication failed"**
- Check that the token is included in the Authorization header
- Verify token hasn't expired (default: 7 days)

**"User not found"**
- Make sure you're registered before trying to login
- Check that the email is correct

## Next Steps

- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Add social login (Google, GitHub)
- [ ] Add user profile editing
- [ ] Add password change functionality

