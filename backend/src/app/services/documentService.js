// backend/src/app/routes/documentsRoutes.js

import express from "express";
import multer from "multer";
import {
  handleUploadAndIngest,
  listDocuments
} from "../services/documentService.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Upload + ingest
router.post("/:workspaceId/upload", upload.array("files"), async (req, res) => {
  const { workspaceId } = req.params;
  const files = req.files || [];
  const created = await handleUploadAndIngest(files, workspaceId);
  res.json({ documents: created });
});

// List documents
router.get("/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;
  const docs = await listDocuments(workspaceId);
  res.json({ documents: docs });
});

export default router;
