import { db } from "../../infra/db/client.js";
import { WorkspaceRepository } from "../interfaces/workspaceRepository.js";

export class WorkspaceRepositoryPostgres extends WorkspaceRepository {
  async create({ name, description }) {
    const result = await db.query(
      `INSERT INTO workspace (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description]
    );

    return result.rows[0];
  }

  async list() {
    const result = await db.query(`SELECT * FROM workspace ORDER BY created_at DESC`);
    return result.rows;
  }
}
