// backend/src/app/services/chunkingService.js

export function chunkDocumentContent(content, chunkSize = 1200, overlap = 200) {
  if (!content || typeof content !== "string") return [];

  const chunks = [];
  let start = 0;

  while (start < content.length) {
    const end = Math.min(start + chunkSize, content.length);
    const chunk = content.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    start = end - overlap;
    if (start < 0) start = 0;
  }

  return chunks;
}

// Legacy compatibility
export const chunkText = chunkDocumentContent;
