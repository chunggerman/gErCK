// backend/src/app/controllers/dataChatController.js

import { answerDataQuestion } from "../services/dataQueryService.js";
import workspaceService from "../services/workspaceService.js";

/**
 * POST /api/chat/data
 * Data‑mode SQL Q&A:
 * - Understand question
 * - Generate SQL
 * - Execute SQL
 * - Summarize results
 */
export async function handleDataChat(req, res) {
  try {
    const { workspaceId, assistantId, question } = req.body;

    if (!workspaceId || !assistantId || !question) {
      return res.status(400).json({
        error: "workspaceId, assistantId, and question are required"
      });
    }

    // Validate workspace + assistant
    const workspace = await workspaceService.getWorkspace(workspaceId);
    const assistant = await workspaceService.getAssistant(assistantId);

    if (!workspace || !assistant) {
      return res.status(404).json({ error: "Workspace or assistant not found" });
    }

    // Run full data‑mode pipeline
    const result = await answerDataQuestion({
      workspaceId,
      question,
      model: assistant.model || "llama3.1"
    });

    return res.json({
      sql: result.sql,
      rows: result.rows,
      answer: result.answer,
      error: result.error
    });
  } catch (err) {
    console.error("handleDataChat error:", err);
    return res.status(500).json({ error: "Data‑mode chat failed" });
  }
}
