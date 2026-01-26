// backend/src/app/routes/documentsRoutes.js

import express from "express";
import {
  uploadDocument,
  listDocuments,
  getDocument,
  getDocumentChunks,
  deleteDocument
} from "../controllers/documentsController.js";

const router = express.Router();

// Upload + ingest a document
router.post("/upload", uploadDocument);

// List all documents in a workspace
router.get("/", listDocuments);

// Get a single document
router.get("/:id", getDocument);

// Get all chunks for a document
router.get("/:id/chunks", getDocumentChunks);

// Delete a document (cascades to chunks + tags)
router.delete("/:id", deleteDocument);

export default router;
