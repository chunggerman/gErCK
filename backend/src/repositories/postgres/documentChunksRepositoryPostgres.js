// backend/src/repositories/postgres/documentChunksRepositoryPostgres.js

import { db } from "../../infra/db/client.js";

export class DocumentChunksRepositoryPostgres {
  async create({
    tenantId,
    workspaceId,
    referenceId,
    content,
    embedding,
    tags = [],
  }) {
    const result = await db.query(
      `
      INSERT INTO document_chunks
      (tenant_id, workspace_id, reference_id, content, embedding, tags)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [tenantId, workspaceId, referenceId, content, embedding, tags]
    );

    return result.rows[0] || null;
  }

  async get(id) {
    const result = await db.query(
      `
      SELECT *
      FROM document_chunks
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] || null;
  }

  async listByWorkspace(workspaceId) {
    const result = await db.query(
      `
      SELECT *
      FROM document_chunks
      WHERE workspace_id = $1
      ORDER BY created_at DESC
      `,
      [workspaceId]
    );

    return result.rows;
  }

  async listByReference(workspaceId, referenceId) {
    const result = await db.query(
      `
      SELECT *
      FROM document_chunks
      WHERE workspace_id = $1
      AND reference_id = $2
      ORDER BY created_at DESC
      `,
      [workspaceId, referenceId]
    );

    return result.rows;
  }

  async delete(id) {
    await db.query(
      `
      DELETE FROM document_chunks
      WHERE id = $1
      `,
      [id]
    );

    return true;
  }
}
