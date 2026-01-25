// backend/src/app/controllers/contentController.js

import { retrieveRelevantChunks } from "../services/ragService.js";

export async function searchContent(req, res) {
  try {
    const { workspaceId, query, topK } = req.body || {};

    if (!workspaceId || !query) {
      return res
        .status(400)
        .json({ error: "workspaceId and query are required" });
    }

    const k = topK || 5;
    const chunks = await retrieveRelevantChunks(workspaceId, query, k);

    return res.json({
      workspaceId,
      query,
      results: chunks
    });
  } catch (err) {
    console.error("searchContent error:", err);
    return res.status(500).json({ error: "Failed to search content" });
  }
}
