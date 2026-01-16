// backend/src/repositories/postgres/chunkRepositoryPostgres.js

import { ChunkRepository } from "../interfaces/chunkRepository.js";

export class ChunkRepositoryPostgres extends ChunkRepository {

  async createMany(client, content_id, chunks) {
    if (!chunks || chunks.length === 0) return [];

    const params = [];
    const values = [];

    chunks.forEach((chunk, i) => {
      const base = i * 4;
      params.push(chunk.text, chunk.token_count, content_id, i);
      values.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
    });

    const sql = `
      INSERT INTO content_chunk (text, token_count, content_id, chunk_index)
      VALUES ${values.join(", ")}
      RETURNING *;
    `;

    const result = await client.query(sql, params);
    return result.rows;
  }

  toPgVector(arr) {
    if (!Array.isArray(arr)) {
      throw new Error("Embedding must be an array");
    }
    return `[${arr.join(",")}]`;
  }

  async updateEmbedding(client, chunkId, embedding) {
    const vectorLiteral = this.toPgVector(embedding);

    const result = await client.query(
      `UPDATE content_chunk
       SET embedding = $1
       WHERE id = $2
       RETURNING *`,
      [vectorLiteral, chunkId]
    );

    return result.rows[0];
  }

  async searchByEmbedding(client, workspaceId, queryEmbedding, limit = 5) {
    const vectorLiteral = this.toPgVector(queryEmbedding);

    const sql = `
      SELECT
        cc.id,
        cc.text,
        cc.chunk_index,
        cc.embedding <-> $1 AS distance
      FROM content_chunk cc
      WHERE cc.content_id IN (
        SELECT id FROM content WHERE workspace_id = $2
      )
      ORDER BY cc.embedding <-> $1
      LIMIT $3;
    `;

    const result = await client.query(sql, [vectorLiteral, workspaceId, limit]);
    return result.rows;
  }
}
