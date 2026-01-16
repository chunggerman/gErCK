// backend/src/infra/db/client.js

import pg from "pg";
import { env } from "../../config/env.js";

const { Pool } = pg;

const connectionString =
  `postgres://${env.DB_USER}:${env.DB_PASSWORD}` +
  `@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

console.log("CONNECTION STRING AT RUNTIME:", connectionString);

export const db = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

console.log("Postgres client initialized (clean, no overrides)");
