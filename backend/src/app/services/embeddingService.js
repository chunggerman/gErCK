// backend/src/app/services/embeddingService.js

import { spawn } from "child_process";

// Call Ollama embedding model
async function ollamaEmbed(text, model = "nomic-embed-text") {
  return new Promise((resolve, reject) => {
    const process = spawn("ollama", ["embeddings", "-m", model], {
      stdio: ["pipe", "pipe", "pipe"]
    });

    let output = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      console.error("Ollama embedding error:", data.toString());
    });

    process.on("close", () => {
      try {
        const parsed = JSON.parse(output);
        resolve(parsed.embedding || []);
      } catch (err) {
        console.error("Failed to parse Ollama embedding:", err);
        resolve([]); // fail gracefully
      }
    });

    process.on("error", reject);

    process.stdin.write(text);
    process.stdin.end();
  });
}

// Public API
export async function embedText(text) {
  const emb = await ollamaEmbed(text);
  return emb;
}

export function cosineSimilarity(a, b) {
  if (!a.length || !b.length || a.length !== b.length) return 0;

  let dot = 0;
  let na = 0;
  let nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
