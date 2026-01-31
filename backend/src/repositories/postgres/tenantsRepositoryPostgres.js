import { db } from "../../infra/db/client.js";

export class TenantsRepositoryPostgres {
  async create({ name }) {
    const encrypted = `enc:${name}`;

    const result = await db.query(
      `
      INSERT INTO tenants (name)
      VALUES ($1)
      RETURNING id
      `,
      [encrypted]
    );

    return {
      id: result.rows[0].id,
      name
    };
  }

  async get(id) {
    const result = await db.query(
      `SELECT * FROM tenants WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}
