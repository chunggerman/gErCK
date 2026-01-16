import { ChunkRepositoryPostgres } from '../repositories/postgres/chunkRepositoryPostgres.js';
import { generateEmbedding } from '../app/services/embeddingService.js';
import { db } from '../infra/db/client.js';

const chunkRepo = new ChunkRepositoryPostgres();

export async function vectorSearch(client, workspaceId, queryEmbedding, topK, filters = {}) {
  // For now, simple vector search. Can be extended with filters
  const chunks = await chunkRepo.searchByEmbedding(client, workspaceId, queryEmbedding, topK);
  return chunks;
}

export async function keywordSearch(client, workspaceId, query, topK, filters = {}) {
  // Simple keyword search - can be improved with full-text search
  const result = await client.query(
    `
    SELECT * FROM content_chunk
    WHERE content_id IN (
      SELECT id FROM content WHERE workspace_id = $1
    )
    AND text ILIKE $2
    LIMIT $3
    `,
    [workspaceId, `%${query}%`, topK]
  );
  return result.rows;
}

export async function hybridRank(vectorResults, keywordResults, config) {
  const { vector_weight, keyword_weight, recency_weight, metadata_weight } = config.retrieval;

  // Create a map for easy lookup
  const chunkMap = new Map();

  // Add vector results with scores
  vectorResults.forEach((chunk, index) => {
    chunkMap.set(chunk.id, {
      ...chunk,
      score: vector_weight * (1 - index / vectorResults.length) // Higher score for top results
    });
  });

  // Add keyword results with scores
  keywordResults.forEach((chunk, index) => {
    const existing = chunkMap.get(chunk.id);
    const keywordScore = keyword_weight * (1 - index / keywordResults.length);
    if (existing) {
      existing.score += keywordScore;
    } else {
      chunkMap.set(chunk.id, {
        ...chunk,
        score: keywordScore
      });
    }
  });

  // Sort by score and return top results
  const ranked = Array.from(chunkMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, config.top_k);

  return ranked;
}

export async function retrieveContext({ workspaceId, query, config }) {
  const client = await db.connect();

  try {
    const queryEmbedding = await generateEmbedding(query);

    const vectorResults = await vectorSearch(client, workspaceId, queryEmbedding, config.top_k * 2, config.retrieval.filters);
    const keywordResults = await keywordSearch(client, workspaceId, query, config.top_k * 2, config.retrieval.filters);

    const rankedChunks = hybridRank(vectorResults, keywordResults, config);

    return rankedChunks;
  } finally {
    client.release();
  }
}
