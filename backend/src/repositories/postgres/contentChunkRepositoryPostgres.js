// backend/src/repositories/postgres/contentChunkRepositoryPostgres.js

import { db } from "../../infra/db/client.js";

export class ContentChunkRepositoryPostgres {
  /**
   * Insert a chunk with embedding.
   * embedding must be an array of numbers matching vector(1536).
   */
  async createChunk({ contentId, text, tokenCount, embedding }) {
    const result = await db.query(
      `
      INSERT INTO content_chunk (content_id, text, token_count, embedding)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [contentId, text, tokenCount, embedding]
    );

    return result.rows[0];
  }

  /**
   * Attach a tag to a chunk.
   * tagId must already exist in the tag table.
   */
  async attachTag(chunkId, tagId) {
    await db.query(
      `
      INSERT INTO content_chunk_tag (content_chunk_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [chunkId, tagId]
    );
    return true;
  }

  /**
   * Get all chunks for a content item.
   */
  async listByContent(contentId) {
    const result = await db.query(
      `
      SELECT *
      FROM content_chunk
      WHERE content_id = $1
      ORDER BY created_at ASC
      `,
      [contentId]
    );

    return result.rows;
  }

  /**
   * Get chunks by tag.
   */
  async listByTag(tagId) {
    const result = await db.query(
      `
      SELECT cc.*
      FROM content_chunk cc
      JOIN content_chunk_tag cct ON cct.content_chunk_id = cc.id
      WHERE cct.tag_id = $1
      ORDER BY cc.created_at DESC
      `,
      [tagId]
    );

    return result.rows;
  }

  /**
   * Semantic search using pgvector.
   * queryEmbedding must be a float[] of length 1536.
   */
  async semanticSearch(workspaceId, queryEmbedding, topK = 5) {
    const result = await db.query(
      `
      SELECT cc.*, (cc.embedding <=> $1) AS distance
      FROM content_chunk cc
      JOIN content c ON c.id = cc.content_id
      WHERE c.workspace_id = $2
      ORDER BY cc.embedding <=> $1
      LIMIT $3
      `,
      [queryEmbedding, workspaceId, topK]
    );

    return result.rows.map((row) => ({
      ...row,
      score: 1 - row.distance // convert cosine distance → similarity
    }));
  }

  /**
   * Fetch chunks by IDs (useful for merging semantic + tag results).
   */
  async getByIds(ids) {
    if (!ids.length) return [];

    const result = await db.query(
      `
      SELECT *
      FROM content_chunk
      WHERE id = ANY($1)
      `,
      [ids]
    );

    return result.rows;
  }
}
