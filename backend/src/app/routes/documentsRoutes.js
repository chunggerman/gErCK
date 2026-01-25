// backend/src/app/routes/documentsRoutes.js

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  handleUploadAndIngest,
  listDocuments
} from "../services/documentService.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/upload", upload.array("files"), async (req, res) => {
  const { workspaceId } = req.body || {};

  if (!workspaceId) {
    return res.status(400).json({ error: "workspaceId is required" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const results = await handleUploadAndIngest(req.files, workspaceId);
    res.status(200).json(results);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload documents" });
  }
});

router.get("/", async (req, res) => {
  const { workspaceId } = req.query;

  if (!workspaceId) {
    return res.status(400).json({ error: "workspaceId is required" });
  }

  try {
    const docs = await listDocuments(workspaceId);
    res.json(docs);
  } catch (err) {
    console.error("List documents error:", err);
    res.status(500).json({ error: "Failed to list documents" });
  }
});

export default router;
