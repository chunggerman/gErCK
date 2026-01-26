import "../config/env.js";

import express from "express";
import cors from "cors";
import path from "path";

import workspaceRoutes from "./routes/workspaceRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import documentsRoutes from "./routes/documentsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import { env } from "../config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

// Debug logging (optional but recommended)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

console.log("SERVER STARTING WITH ENV:", {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  pass: env.DB_PASSWORD,
  name: env.DB_NAME
});

// API routes
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/assistants", assistantRoutes);   // FIXED
app.use("/api/documents", documentsRoutes);
app.use("/api/chat", chatRoutes);              // ADDED

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Port
const PORT = env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
