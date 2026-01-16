// backend/src/app/controllers/assistantController.js

import { db } from "../../infra/db/client.js";
import { ChunkRepositoryPostgres } from "../../repositories/postgres/chunkRepositoryPostgres.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { generateLLMAnswer } from "../services/llmService.js";

const chunkRepo = new ChunkRepositoryPostgres();

export async function answerQuestion(req, res) {
  const client = await db.connect();

  try {
    const { workspace_id, query, limit = 5 } = req.body;

    // 1. Embed the query
    const queryEmbedding = await generateEmbedding(query);

    // 2. Retrieve top‑k chunks
    const chunks = await chunkRepo.searchByEmbedding(
      client,
      workspace_id,
      queryEmbedding,
      limit
    );

    // 3. Build prompt
    const context = chunks
      .map((c, i) => `Chunk ${i + 1}:\n${c.text}`)
      .join("\n\n");

    const prompt = `
You are a helpful assistant. Use ONLY the provided context to answer the user's question.

Context:
${context}

User question:
${query}

Answer concisely and accurately using only the context.
    `.trim();

    // 4. Generate answer
    const answer = await generateLLMAnswer(prompt);

    res.json({
      answer,
      retrieved_chunks: chunks
    });

  } catch (err) {
    console.error("ASSISTANT ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
