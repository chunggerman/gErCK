// backend/src/repositories/postgres/tagRepositoryPostgres.js

import { db } from "../../infra/db/client.js";

export class TagRepositoryPostgres {
  /**
   * Find a tag by name.
   */
  async findByName(name) {
    const result = await db.query(
      `
      SELECT *
      FROM tag
      WHERE name = $1
      `,
      [name]
    );

    return result.rows[0] || null;
  }

  /**
   * Create a new tag.
   */
  async create(name) {
    const result = await db.query(
      `
      INSERT INTO tag (name)
      VALUES ($1)
      RETURNING *
      `,
      [name]
    );

    return result.rows[0];
  }

  /**
   * Find or create a tag by name.
   * Ensures deduplication.
   */
  async findOrCreate(name) {
    const existing = await this.findByName(name);
    if (existing) return existing;

    return await this.create(name);
  }

  /**
   * Attach a tag to a chunk.
   * Uses ON CONFLICT DO NOTHING to avoid duplicates.
   */
  async attachToChunk(chunkId, tagId) {
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
   * List all tags for a given chunk.
   */
  async listTagsForChunk(chunkId) {
    const result = await db.query(
      `
      SELECT t.*
      FROM tag t
      JOIN content_chunk_tag cct ON cct.tag_id = t.id
      WHERE cct.content_chunk_id = $1
      ORDER BY t.name ASC
      `,
      [chunkId]
    );

    return result.rows;
  }

  /**
   * List all chunks associated with a given tag.
   * (Useful for tag‑based retrieval.)
   */
  async listChunksForTag(tagId) {
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
}
