// backend/src/app/services/llmService.js

// Node 24 has global fetch — no import needed

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3"; // or any model you prefer

export async function generateLLMAnswer(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama LLM request failed: ${response.status} — ${body}`);
  }

  const data = await response.json();

  return data.response;
}
