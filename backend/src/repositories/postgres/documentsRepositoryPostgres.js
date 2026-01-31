import { db } from "../../infra/db/client.js";

export class DocumentsRepositoryPostgres {
  async create({ tenantId, workspaceId, name, content }) {
    const result = await db.query(
      `
      INSERT INTO documents (tenant_id, workspace_id, name, content)
      VALUES ($1, $2, $3, $4)
      RETURNING id, tenant_id, workspace_id, name, content
      `,
      [tenantId, workspaceId, name, content]
    );

    return result.rows[0] || null;
  }

  async get(id) {
    const result = await db.query(
      `SELECT * FROM documents WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}
