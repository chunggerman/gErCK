// backend/src/repositories/postgres/referencesRepositoryPostgres.js

import { db } from "../../infra/db/client.js";

export class ReferencesRepositoryPostgres {
  async create({ workspaceId, name, description }) {
    const result = await db.query(
      `
      INSERT INTO workspace_references (workspace_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [workspaceId, name, description]
    );
    return result.rows[0];
  }

  async listByWorkspace(workspaceId) {
    const result = await db.query(
      `
      SELECT r.*,
        (SELECT COUNT(*) FROM documents d WHERE d.reference_id = r.id) AS document_count
      FROM workspace_references r
      WHERE r.workspace_id = $1
      ORDER BY created_at DESC
      `,
      [workspaceId]
    );
    return result.rows;
  }

  async get(id) {
    const result = await db.query(
      `SELECT * FROM workspace_references WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async update(id, { name, description }) {
    const result = await db.query(
      `
      UPDATE workspace_references
      SET name = $2, description = $3
      WHERE id = $1
      RETURNING *
      `,
      [id, name, description]
    );
    return result.rows[0];
  }

  async delete(id) {
    await db.query(`DELETE FROM workspace_references WHERE id = $1`, [id]);
    return true;
  }
}
