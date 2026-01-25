// backend/src/app/server.js

import "../config/env.js";

import express from "express";
import cors from "cors";
import path from "path";

import workspaceRoutes from "./routes/workspaceRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import documentsRoutes from "./routes/documentsRoutes.js";

import { env } from "../config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

console.log("SERVER STARTING WITH ENV:", {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  pass: env.DB_PASSWORD,
  name: env.DB_NAME
});

app.use("/api/workspaces", workspaceRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/documents", documentsRoutes);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
