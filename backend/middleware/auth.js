import { extractToken, verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ message: "No token provided. Authentication required." });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Authentication failed." });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token exists, but doesn't fail if it doesn't
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.userId).select("-password");
        if (user) {
          req.user = user;
          req.userId = user._id.toString();
        }
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
