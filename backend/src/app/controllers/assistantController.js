// backend/src/app/controllers/assistantController.js

import { retrieveRelevantChunks } from "../services/ragService.js";
import { callLLM, streamLLM } from "../services/llmService.js";

/**
 * POST /api/assistant/message
 * Non‑streaming legacy endpoint
 */
export async function handleAssistantMessage(req, res) {
  try {
    const { workspaceId, message } = req.body || {};

    if (!workspaceId || !message) {
      return res
        .status(400)
        .json({ error: "workspaceId and message are required" });
    }

    const chunks = await retrieveRelevantChunks(workspaceId, message, 5);
    const context = chunks.map((c) => `- ${c.text}`).join("\n");

    const prompt = `
You are a grounded assistant. Use ONLY the provided context to answer the question.
If the answer is not in the context, say exactly: "The document does not mention this."

Context:
${context || "(no relevant context found)"}

Question:
${message}
`;

    const reply = await callLLM(prompt);

    return res.json({ reply, contextChunks: chunks });
  } catch (err) {
    console.error("handleAssistantMessage error:", err);
    return res.status(500).json({ error: "Failed to process assistant message" });
  }
}

/**
 * POST /api/assistant/query
 * Streaming endpoint
 */
export async function handleAssistantQuery(req, res) {
  try {
    const { question, templateId, workspaceId, config } = req.body || {};

    if (!question || !workspaceId) {
      return res.status(400).json({
        error: "question and workspaceId are required"
      });
    }

    let ragResult = null;
    if (config?.retrieval?.enabled !== false) {
      ragResult = await retrieveRelevantChunks(
        workspaceId,
        question,
        config?.retrieval?.topK || 5
      );
    }

    const context = ragResult
      ? ragResult.map((c) => `- ${c.text}`).join("\n")
      : "";

    const prompt = `
System Prompt:
${config?.messageOverrides?.systemPrompt || "You are a helpful assistant."}

Context:
${context || "(no relevant context found)"}

User Question:
${question}
`;

    // Set ALL headers BEFORE streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("X-RAG-Metadata", JSON.stringify(ragResult || []));

    const stream = await streamLLM(prompt, config);

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
    console.error("handleAssistantQuery error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Query failed" });
    }
    res.end();
  }
}
