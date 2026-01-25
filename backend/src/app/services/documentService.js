// backend/src/app/services/documentService.js

import fs from "fs";
import path from "path";

const documents = [];

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";

export async function handleUploadAndIngest(files, workspaceId) {
  const now = new Date().toISOString();

  const created = files.map((file) => {
    const doc = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      workspaceId,
      filename: file.originalname,
      storedFilename: file.filename,
      path: `uploads/${file.filename}`,
      url: `${SERVER_URL}/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
      content: file.originalname,
      status: "uploaded",
      createdAt: now,
      updatedAt: now
    };

    documents.push(doc);

    setTimeout(() => {
      doc.status = "ready";
      doc.updatedAt = new Date().toISOString();
    }, 2000);

    return doc;
  });

  return created;
}

export async function listDocuments(workspaceId) {
  return documents
    .filter((d) => d.workspaceId === workspaceId)
    .map((d) => ({
      ...d,
      path: d.path || `uploads/${d.storedFilename}`,
      url: d.url || `${SERVER_URL}/uploads/${d.storedFilename}`
    }));
}

export function getAllDocuments() {
  return documents;
}
