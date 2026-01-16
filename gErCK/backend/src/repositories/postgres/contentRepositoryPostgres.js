import { db } from "../../infra/db/client.js";
import { ContentRepository } from "../interfaces/contentRepository.js";

export class ContentRepositoryPostgres extends ContentRepository {
  async create({ workspace_id, title, source_type, raw_text }) {
    const result = await db.query(
      `INSERT INTO content (workspace_id, title, source_type, raw_text)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [workspace_id, title, source_type, raw_text]
    );

    return result.rows[0];
  }

  async getById(id) {
    const result = await db.query(
      `SELECT * FROM content WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }
}
