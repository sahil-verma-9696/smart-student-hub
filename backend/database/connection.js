import mongoose from "mongoose";
import { env } from "../env/config.js";

async function connectDB(DATABASE_NAME) {
  try {
    await mongoose.connect(`${env.MONGO_URI}/${DATABASE_NAME}`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectDB;
