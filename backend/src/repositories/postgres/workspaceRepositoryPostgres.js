import { db } from "../../infra/db/client.js";

export class WorkspacesRepositoryPostgres {
  async create({ tenantId, name }) {
    const result = await db.query(
      `
      INSERT INTO workspaces (tenant_id, name)
      VALUES ($1, $2)
      RETURNING id, tenant_id, name
      `,
      [tenantId, name]
    );

    return result.rows[0] || null;
  }

  async get(id) {
    const result = await db.query(
      `SELECT * FROM workspaces WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}
