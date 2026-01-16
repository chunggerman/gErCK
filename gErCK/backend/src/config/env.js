// backend/src/config/env.js

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Resolve backend/.env explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

export const env = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT || 3001
};

console.log("ENV LOADED IN CONFIG:", {
  path: envPath,
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  pass: env.DB_PASSWORD,
  name: env.DB_NAME
});
