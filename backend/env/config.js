import dotenv from "dotenv";

// Load env file depending on NODE_ENV
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

// Utility: safely get env variables
function getEnv(key, required = true) {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: getEnv("PORT"),
  
  JWT_SECRET: getEnv("JWT_SECRET"),

  CLOUDINARY_CLOUDNAME: getEnv("CLOUDINARY_CLOUDNAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_SECRET: getEnv("CLOUDINARY_SECRET"),
  CLOUDINARY_CLOUDNAME: getEnv("CLOUDINARY_CLOUDNAME"),

  MONGO_URI: getEnv("MONGO_URI"),

  CLIENTS_URL: getEnv("CLIENTS_URL"),

  ABC : getEnv("CLIENTS_URL"),
};