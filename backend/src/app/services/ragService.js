// backend/src/app/services/ragService.js

import { ContentChunkRepositoryPostgres } from "../../repositories/postgres/contentChunkRepositoryPostgres.js";
import { TagRepositoryPostgres } from "../../repositories/postgres/tagRepositoryPostgres.js";
import { embedText, cosineSimilarity } from "./embeddingService.js";

const chunkRepo = new ContentChunkRepositoryPostgres();
const tagRepo = new TagRepositoryPostgres();

/**
 * Resolve tag names → tagIds → chunks.
 */
async function getChunksByTags(tagNames = []) {
  if (!tagNames.length) return [];

  const uniqueNames = [...new Set(tagNames.map((t) => t.toLowerCase().trim()))];
  const allChunks = [];

  for (const name of uniqueNames) {
    const tag = await tagRepo.findByName(name);
    if (!tag) continue;

    const chunks = await tagRepo.listChunksForTag(tag.id);
    for (const c of chunks) {
      allChunks.push({
        ...c,
        source: "tag",
        tagName: name
      });
    }
  }

  return allChunks;
}

/**
 * Merge semantic + tag results:
 * - dedupe by chunk id
 * - combine scores
 * - sort by finalScore desc
 */
function mergeResults({ semanticResults, tagResults }) {
  const byId = new Map();

  for (const r of semanticResults) {
    byId.set(r.id, {
      ...r,
      semanticScore: r.score || 0,
      tagScore: 0,
      sources: new Set(["semantic"])
    });
  }

  for (const r of tagResults) {
    const existing = byId.get(r.id);
    if (existing) {
      existing.tagScore = Math.max(existing.tagScore, 1); // tag hit = strong signal
      existing.sources.add("tag");
      byId.set(r.id, existing);
    } else {
      byId.set(r.id, {
        ...r,
        semanticScore: 0,
        tagScore: 1,
        sources: new Set(["tag"])
      });
    }
  }

  const merged = Array.from(byId.values()).map((r) => {
    const semanticWeight = 0.7;
    const tagWeight = 0.3;

    const finalScore =
      semanticWeight * (r.semanticScore || 0) +
      tagWeight * (r.tagScore || 0);

    return {
      ...r,
      finalScore,
      sources: Array.from(r.sources)
    };
  });

  merged.sort((a, b) => b.finalScore - a.finalScore);
  return merged;
}

/**
 * Enhanced RAG:
 * - semantic search via pgvector
 * - optional tag search
 * - hybrid merge
 */
export async function retrieveRelevantChunks(
  workspaceId,
  query,
  topK = 5,
  { tagNames = [] } = {}
) {
  if (!query && !tagNames.length) return [];

  // 1. Semantic search (if query provided)
  let semanticResults = [];
  if (query) {
    const queryEmbedding = await embedText(query);
    semanticResults = await chunkRepo.semanticSearch(
      workspaceId,
      queryEmbedding,
      topK
    );

    // Normalize scores if needed (distance → similarity already handled in repo)
    semanticResults = semanticResults.map((r) => ({
      ...r,
      source: "semantic"
    }));
  }

  // 2. Tag-based retrieval (if tags provided)
  const tagResults = tagNames.length ? await getChunksByTags(tagNames) : [];

  // 3. Merge
  const merged = mergeResults({ semanticResults, tagResults });

  // 4. Truncate to topK overall
  return merged.slice(0, topK);
}

/**
 * Optional: summarize retrieved chunks + question into a clean answer.
 * This is where you "pick all tag and semantic result to summarise and clean up no need stuff".
 */
export async function summarizeRagAnswer({ question, chunks, model = "llama3.1" }, llmCaller) {
  if (!chunks.length) return { answer: "No relevant information found.", usedChunks: [] };

  const context = chunks
    .map(
      (c, idx) =>
        `[#${idx + 1}] (score: ${c.finalScore?.toFixed(3) ?? "n/a"})\n${c.text}`
    )
    .join("\n\n");

  const prompt = `
You are an expert assistant answering questions based on provided context.

Context chunks:
${context}

Question:
${question}

Instructions:
- Use ONLY the information in the context chunks.
- Synthesize a clear, concise answer.
- Ignore irrelevant or redundant details.
- If the answer is uncertain, say so explicitly.

Answer:
`;

  const answer = await llmCaller(prompt, { model });
  return { answer, usedChunks: chunks };
}
