// backend/src/repositories/postgres/contentRepositoryPostgres.js

import { db } from "../../infra/db/client.js";

export class ContentRepositoryPostgres {
  /**
   * Create a new content record.
   * rawText may be null initially (e.g., for PDFs before extraction).
   * metadata is a JSON object (auto-tags, file info, etc.)
   */
  async create({ workspaceId, title, sourceType, rawText = null, metadata = {} }) {
    const result = await db.query(
      `
      INSERT INTO content (workspace_id, title, source_type, raw_text, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [workspaceId, title, sourceType, rawText, metadata]
    );

    return result.rows[0];
  }

  /**
   * Update raw text after extraction (PDF, DOCX, etc.)
   */
  async updateRawText(contentId, rawText) {
    const result = await db.query(
      `
      UPDATE content
      SET raw_text = $1
      WHERE id = $2
      RETURNING *
      `,
      [rawText, contentId]
    );

    return result.rows[0];
  }

  /**
   * Update metadata JSONB (merge, not replace)
   */
  async updateMetadata(contentId, metadataPatch) {
    const result = await db.query(
      `
      UPDATE content
      SET metadata = metadata || $1::jsonb
      WHERE id = $2
      RETURNING *
      `,
      [metadataPatch, contentId]
    );

    return result.rows[0];
  }

  /**
   * Fetch a single content item
   */
  async getById(contentId) {
    const result = await db.query(
      `SELECT * FROM content WHERE id = $1`,
      [contentId]
    );
    return result.rows[0] || null;
  }

  /**
   * List all content for a workspace
   */
  async listByWorkspace(workspaceId) {
    const result = await db.query(
      `
      SELECT *
      FROM content
      WHERE workspace_id = $1
      ORDER BY created_at DESC
      `,
      [workspaceId]
    );

    return result.rows;
  }

  /**
   * Delete content (cascades to chunks + tags)
   */
  async delete(contentId) {
    await db.query(
      `DELETE FROM content WHERE id = $1`,
      [contentId]
    );
    return true;
  }
}
