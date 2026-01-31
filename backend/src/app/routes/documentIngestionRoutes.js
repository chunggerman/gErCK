// backend/src/app/routes/documentIngestionRoutes.js

import express from "express";
import { ingestDocument } from "../controllers/documentIngestionController.js";

const router = express.Router();

router.post("/ingest", ingestDocument);

export default router;
