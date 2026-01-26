// backend/src/app/services/chunkingService.js

/**
 * Tokenize text into an array of "tokens".
 * This is a simple whitespace + punctuation tokenizer.
 * You can later replace this with a tiktoken-based tokenizer if needed.
 */
function tokenize(text) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
}

/**
 * Reconstruct text from tokens.
 */
function detokenize(tokens) {
  return tokens.join(" ");
}

/**
 * Chunk text using a sliding window.
 * size = max tokens per chunk
 * overlap = tokens carried over to next chunk
 */
export function chunkText(
  text,
  { size = 800, overlap = 100 } = {}
) {
  if (!text || typeof text !== "string") return [];

  const tokens = tokenize(text);
  const chunks = [];

  let start = 0;
  const total = tokens.length;

  while (start < total) {
    const end = Math.min(start + size, total);
    const chunkTokens = tokens.slice(start, end);

    chunks.push({
      text: detokenize(chunkTokens),
      tokenCount: chunkTokens.length
    });

    // Move window forward with overlap
    start = end - overlap;
    if (start < 0) start = 0;
  }

  return chunks;
}
