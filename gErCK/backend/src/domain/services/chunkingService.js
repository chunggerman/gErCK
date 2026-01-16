export class ChunkingService {
  constructor() {
    this.maxChunkSize = 500; // characters per chunk (Phase‑1 simple strategy)
  }

  chunkText(rawText) {
    const chunks = [];
    let start = 0;

    while (start < rawText.length) {
      const end = Math.min(start + this.maxChunkSize, rawText.length);
      const textChunk = rawText.slice(start, end);

      chunks.push({
        text: textChunk,
        token_count: textChunk.length // simple proxy for now
      });

      start = end;
    }

    return chunks;
  }
}
