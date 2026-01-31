import { db } from "../../infra/db/client.js";

export class UsageRepositoryPostgres {
  async logUsage({ assistantId }) {
    await db.query(
      `
      INSERT INTO usage (assistant_id)
      VALUES ($1)
      `,
      [assistantId]
    );
  }
}
