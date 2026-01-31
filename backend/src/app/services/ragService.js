// backend/src/app/services/ragService.js

import fetch from "node-fetch";
import { db } from "../../infra/db/client.js";

export async function runRagAnswer({
  aiConfig,
  tenantId,
  workspaceId,
  assistantId,
  question,
  referenceIds = [],
  topK = 8,
  metadata = {},
}) {
  const endpoint = aiConfig.endpoint;
  const apiKey = aiConfig.apiKey;
  const model = aiConfig.model;

  const refFilter =
    referenceIds.length > 0
      ? `AND reference_id = ANY($4)`
      : "";

  const result = await db.query(
    `
    SELECT id, content, embedding
    FROM document_chunks
    WHERE workspace_id = $1
    ${refFilter}
    ORDER BY embedding <-> (SELECT embedding FROM ai_embed($2, $3))
    LIMIT $5
    `,
    referenceIds.length > 0
      ? [workspaceId, question, model, referenceIds, topK]
      : [workspaceId, question, model, topK]
  );

  const contextChunks = result.rows || [];

  const contextText = contextChunks
    .map((c) => c.content)
    .join("\n---\n");

  const body = {
    model,
    messages: [
      {
        role: "system",
        content: "You answer questions using the provided context.",
      },
      {
        role: "user",
        content: `Context:\n${contextText}\n\nQuestion: ${question}`,
      },
    ],
    metadata,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`RAG request failed: ${errText}`);
  }

  const data = await response.json();

  return {
    answer: data?.choices?.[0]?.message?.content || "",
    contextChunks,
    usage: {
      model,
      tokensIn: data?.usage?.prompt_tokens ?? 0,
      tokensOut: data?.usage?.completion_tokens ?? 0,
    },
  };
}
