// backend/src/app/services/embeddingService.js

import fetch from "node-fetch";

export async function generateEmbedding({ aiConfig, text }) {
  const endpoint = aiConfig.embeddingEndpoint || aiConfig.endpoint;
  const apiKey = aiConfig.apiKey;
  const model = aiConfig.embeddingModel || aiConfig.model;

  const body = {
    model,
    input: text,
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
    throw new Error(`Embedding generation failed: ${errText}`);
  }

  const data = await response.json();

  return {
    embedding: data?.data?.[0]?.embedding || [],
    usage: {
      model,
      tokensIn: data?.usage?.prompt_tokens ?? 0,
      tokensOut: data?.usage?.completion_tokens ?? 0,
    },
  };
}
