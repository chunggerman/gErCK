import { db } from "../../infra/db/client.js";

export class AssistantsRepositoryPostgres {
  async create({ tenantId, workspaceId, name, model }) {
    const result = await db.query(
      `
      INSERT INTO assistants (tenant_id, workspace_id, name, model)
      VALUES ($1, $2, $3, $4)
      RETURNING id, tenant_id, workspace_id, name, model
      `,
      [tenantId, workspaceId, name, model]
    );

    return result.rows[0] || null;
  }

  async get(id) {
    const result = await db.query(
      `SELECT * FROM assistants WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}
