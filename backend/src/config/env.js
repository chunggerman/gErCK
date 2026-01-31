// backend/src/config/env.js

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve backend root explicitly
const backendRoot = path.resolve(__dirname, "../..");

// Load .env from backend/.env
const envPath = path.join(backendRoot, ".env");

console.log("LOADING ENV FROM:", envPath);

dotenv.config({ path: envPath });

export const env = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT || 3001
};
