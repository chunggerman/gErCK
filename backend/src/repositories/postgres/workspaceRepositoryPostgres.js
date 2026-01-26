// backend/src/repositories/postgres/workspaceRepositoryPostgres.js

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
    const result = await db.query(
      `SELECT * FROM workspace ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async getById(id) {
    const result = await db.query(
      `SELECT * FROM workspace WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async createAssistant({ workspaceId, name, description, model }) {
    const result = await db.query(
      `INSERT INTO assistant (workspace_id, name, description, model)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [workspaceId, name, description, model]
    );

    return result.rows[0];
  }

  async getAssistant(id) {
    const result = await db.query(
      `SELECT * FROM assistant WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async updateAssistant(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }

    values.push(id);

    const result = await db.query(
      `UPDATE assistant
       SET ${fields.join(", ")}
       WHERE id = $${idx}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }
}
