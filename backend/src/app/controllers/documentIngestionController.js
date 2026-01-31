// backend/src/app/controllers/documentIngestionController.js

import { DocumentsRepositoryPostgres } from "../../repositories/postgres/documentsRepositoryPostgres.js";
import { DocumentChunksRepositoryPostgres } from "../../repositories/postgres/documentChunksRepositoryPostgres.js";
import { WorkspacesRepositoryPostgres } from "../../repositories/postgres/workspaceRepositoryPostgres.js";
import { chunkText } from "../services/chunkingService.js";
import { runAiTagging } from "../services/taggingService.js";
import { db } from "../../infra/db/client.js";

const documentsRepo = new DocumentsRepositoryPostgres();
const chunksRepo = new DocumentChunksRepositoryPostgres();
const workspacesRepo = new WorkspacesRepositoryPostgres();

export const ingestDocument = async (req, res) => {
  try {
    const {
      workspaceId,
      referenceId = null,
      content,
      tags = "",
      metadata = {},
      name,
      chunkSize,
      chunkOverlap,
    } = req.body;

    if (!workspaceId || !content) {
      return res.status(400).json({ error: "workspaceId and content are required" });
    }

    const workspace = await workspacesRepo.get(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const manualTags = tags
      ? tags.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    let contentTags = [];
    try {
      const taggingResult = await runAiTagging({
        aiConfig: req.aiConfig,
        content,
        referenceTags: manualTags,
        metadata,
      });
      contentTags = taggingResult.tags || [];
    } catch (err) {
      console.error("AI tagging failed:", err);
    }

    const finalTags = [...new Set([...manualTags, ...contentTags])];

    const document = await documentsRepo.create({
      workspaceId,
      referenceId,
      name: name || "Untitled",
      content,
      tags: finalTags,
    });

    const parsedChunkSize = chunkSize ? parseInt(chunkSize, 10) : undefined;
    const parsedOverlap = chunkOverlap ? parseInt(chunkOverlap, 10) : undefined;

    const chunks = chunkText(content, {
      chunkSize: parsedChunkSize,
      overlap: parsedOverlap,
    });

    await chunksRepo.insertChunks(document.id, chunks);

    return res.json({
      document,
      chunks,
    });
  } catch (err) {
    console.error("ingestDocument error:", err);
    return res.status(500).json({ error: "Failed to ingest document" });
  }
};
