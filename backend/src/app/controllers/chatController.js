// backend/src/app/controllers/chatController.js

import workspaceService from "../services/workspaceService.js";
import { runRagAnswer } from "../services/ragService.js";
import { callLLM, streamLLM } from "../services/llmService.js";

/**
 * POST /api/chat
 * Enhanced non‑streaming chat with hybrid RAG (semantic + tags)
 */
export async function handleChat(req, res) {
  try {
    const { workspaceId, assistantId, messages, tags = [] } = req.body;

    if (!workspaceId || !assistantId || !messages) {
      return res.status(400).json({
        error: "workspaceId, assistantId, and messages are required"
      });
    }

    const workspace = await workspaceService.getWorkspace(workspaceId);
    const assistant = await workspaceService.getAssistant(assistantId);

    if (!workspace || !assistant) {
      return res.status(404).json({ error: "Workspace or assistant not found" });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const ragResult = await runRagAnswer({
      aiConfig: assistant.aiConfig,
      tenantId: workspace.tenant_id,
      workspaceId,
      assistantId,
      question: lastUserMessage,
      referenceIds: tags,
      topK: assistant?.retrievalTopK || 5,
      metadata: {},
    });

    return res.json({
      reply: ragResult.answer,
      contextChunks: ragResult.contextChunks
    });
  } catch (err) {
    console.error("handleChat error:", err);
    return res.status(500).json({ error: "Chat failed" });
  }
}

/**
 * POST /api/chat/stream
 * Enhanced streaming chat with hybrid RAG (semantic + tags)
 */
export async function handleChatStream(req, res) {
  try {
    const { workspaceId, assistantId, messages, tags = [] } = req.body;

    if (!workspaceId || !assistantId || !messages) {
      return res.status(400).json({
        error: "workspaceId, assistantId, and messages are required"
      });
    }

    const workspace = await workspaceService.getWorkspace(workspaceId);
    const assistant = await workspaceService.getAssistant(assistantId);

    if (!workspace || !assistant) {
      return res.status(404).json({ error: "Workspace or assistant not found" });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const ragResult = await runRagAnswer({
      aiConfig: assistant.aiConfig,
      tenantId: workspace.tenant_id,
      workspaceId,
      assistantId,
      question: lastUserMessage,
      referenceIds: tags,
      topK: assistant?.retrievalTopK || 5,
      metadata: {},
    });

    const context = ragResult.contextChunks
      .map(
        (c, idx) =>
          `[#${idx + 1}]\n${c.content}`
      )
      .join("\n\n");

    const prompt = `
You are an expert assistant answering questions based on provided context.

Context:
${context}

Question:
${lastUserMessage}

Instructions:
- Use ONLY the information in the context.
- Synthesize a clear, concise answer.
- Ignore irrelevant or redundant details.
- If uncertain, say so explicitly.

Answer:
`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("X-RAG-Metadata", JSON.stringify(ragResult.contextChunks));

    const stream = await streamLLM(prompt, {
      model: assistant.model || "llama3.1"
    });

    stream.on("data", (chunk) => {
      res.write(chunk.toString());
    });

    stream.on("end", () => {
      res.end();
    });

    stream.on("error", (err) => {
      console.error("LLM stream error:", err);
      if (!res.headersSent) {
        res.status(500).end("Error during streaming");
      } else {
        res.end();
      }
    });
  } catch (err) {
    console.error("handleChatStream error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Streaming failed" });
    }
    res.end();
  }
}
