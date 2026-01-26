// backend/src/app/services/llmService.js

import { spawn } from "child_process";

// Non‑streaming LLM call (Ollama)
export async function callLLM(prompt, { model = "llama3.1" } = {}) {
  return new Promise((resolve, reject) => {
    const process = spawn("ollama", ["run", model], {
      stdio: ["pipe", "pipe", "pipe"]
    });

    let output = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      console.error("Ollama error:", data.toString());
    });

    process.on("close", () => resolve(output.trim()));
    process.on("error", reject);

    process.stdin.write(prompt);
    process.stdin.end();
  });
}

// Streaming LLM call (Ollama)
export async function streamLLM(prompt, { model = "llama3.1" } = {}) {
  const { Readable } = await import("stream");

  const stream = new Readable({
    read() {}
  });

  const process = spawn("ollama", ["run", model], {
    stdio: ["pipe", "pipe", "pipe"]
  });

  process.stdout.on("data", (data) => {
    stream.push(data.toString());
  });

  process.stderr.on("data", (data) => {
    console.error("Ollama stream error:", data.toString());
  });

  process.on("close", () => {
    stream.push(null);
  });

  process.stdin.write(prompt);
  process.stdin.end();

  return stream;
}
