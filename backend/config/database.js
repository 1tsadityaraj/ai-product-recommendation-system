import mongoose from "mongoose";

/**
 * Database connection configuration
 * Supports both MongoDB Atlas (cloud) and local MongoDB
 */
export const connectDatabase = async () => {
  try {
    // MongoDB Atlas (cloud) connection string format:
    // mongodb+srv://username:password@cluster.mongodb.net/database-name
    // Local MongoDB format:
    // mongodb://localhost:27017/database-name
    
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-product-recommendation";
    
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(MONGODB_URI);

    const connectionType = MONGODB_URI.includes("mongodb+srv") ? "MongoDB Atlas (Cloud)" : "Local MongoDB";
    console.log(`✅ ${connectionType} Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.error("💡 Make sure your MONGODB_URI is correct in the .env file");
    console.error("💡 For MongoDB Atlas, ensure your IP is whitelisted and credentials are correct");
    process.exit(1);
  }
};

export default connectDatabase;
