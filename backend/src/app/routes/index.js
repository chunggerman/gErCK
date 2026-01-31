// backend/src/app/routes/index.js

import { Router } from "express";

import assistantRoutes from "./assistantRoutes.js";
import documentIngestionRoutes from "./documentIngestionRoutes.js";

const router = Router();

// Assistant chat + RAG
router.use("/assistant", assistantRoutes);

// Document ingestion
router.use("/documents", documentIngestionRoutes);

export default router;
