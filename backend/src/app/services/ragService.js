// backend/src/app/services/ragService.js

import { embedText, cosineSimilarity } from "./embeddingService.js";
import { getAllDocuments } from "./documentService.js";

function chunkDocument(doc) {
  return [
    {
      id: doc.id,
      text: doc.content || doc.filename || "",
      sourceDocumentId: doc.id
    }
  ];
}

export async function retrieveRelevantChunks(workspaceId, query, topK = 5) {
  const docs = getAllDocuments().filter((d) => d.workspaceId === workspaceId);

  const chunks = docs.flatMap((doc) => chunkDocument(doc));
  if (!chunks.length) return [];

  const queryEmbedding = embedText(query);

  const scored = chunks.map((c) => {
    const emb = embedText(c.text);
    const score = cosineSimilarity(queryEmbedding, emb);
    return { ...c, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((c) => c.score > 0);
}
