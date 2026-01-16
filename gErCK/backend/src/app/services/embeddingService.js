// backend/src/app/services/embeddingService.js

// Node 24 has global fetch — no import needed

const OLLAMA_URL = "http://localhost:11434/api/embeddings";
const MODEL = "nomic-embed-text";

export async function generateEmbedding(text) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: text
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama embedding request failed: ${response.status} — ${body}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.embedding)) {
    throw new Error("Expected embedding to be an array");
  }

  return data.embedding;
}
