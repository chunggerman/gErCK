// backend/src/infra/llm/ollamaEmbeddingProvider.js

import axios from "axios";

export class OllamaEmbeddingProvider {
  constructor(model = "nomic-embed-text") {
    this.model = model;
    this.baseUrl = "http://localhost:11434/api/embeddings";
  }

  async embed(text) {
    console.log("\n=== CALLING OLLAMA ===");
    console.log("Model:", this.model);
    console.log("Prompt preview:", text.slice(0, 50));

    const response = await axios.post(this.baseUrl, {
      model: this.model,
      prompt: text
    });

    const vector = response.data.embedding;

    console.log("Ollama embedding type:", typeof vector);
    console.log("Ollama embedding is array:", Array.isArray(vector));
    console.log("Ollama embedding length:", vector?.length);
    console.log("Ollama first 5:", vector?.slice?.(0, 5));

    if (!Array.isArray(vector)) {
      throw new Error("Ollama returned invalid embedding format");
    }

    return vector;
  }
}
