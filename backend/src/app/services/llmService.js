// backend/src/app/services/llmService.js

export async function callLLM(prompt) {
  const lastLines = prompt.split("\n").slice(-6).join(" ");
  return `LLM (stub) answer based on: ${lastLines}`;
}

export async function streamLLM(prompt, config) {
  const { Readable } = await import("stream");

  const lastLines = prompt.split("\n").slice(-6).join(" ");
  const fullResponse = `LLM (streaming stub) answer based on: ${lastLines}`;

  const chunks = fullResponse.match(/.{1,25}/g) || [];

  let index = 0;

  const stream = new Readable({
    read() {
      if (index < chunks.length) {
        this.push(chunks[index]);
        index++;
      } else {
        this.push(null);
      }
    }
  });

  return stream;
}
