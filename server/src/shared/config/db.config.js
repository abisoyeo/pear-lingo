import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};
