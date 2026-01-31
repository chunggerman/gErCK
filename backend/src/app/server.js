// backend/src/app/server.js

import express from "express";
import tenantsRoutes from "./routes/tenantsRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import documentsRoutes from "./routes/documentsRoutes.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/tenants", tenantsRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/assistants", assistantRoutes);
app.use("/api/documents", documentsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
