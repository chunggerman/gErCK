// backend/src/app/services/usageLogger.js

import EventEmitter from "events";
import { db } from "../../infra/db/client.js";

class UsageEmitter extends EventEmitter {}
export const usageEmitter = new UsageEmitter();

usageEmitter.on("usage", async (payload) => {
  try {
    const {
      tenantId,
      workspaceId,
      assistantId,
      model,
      tokensIn,
      tokensOut,
      path,
      createdAt,
    } = payload;

    const requestType = path.startsWith("/builder/")
      ? "builder"
      : path.startsWith("/assistant/")
      ? "user"
      : "system";

    await db.query(
      `
      INSERT INTO tenant_usage
      (tenant_id, workspace_id, assistant_id, request_type, model, tokens_in, tokens_out, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        tenantId,
        workspaceId,
        assistantId,
        requestType,
        model,
        tokensIn,
        tokensOut,
        createdAt,
      ]
    );

    if (assistantId) {
      await db.query(
        `
        INSERT INTO assistant_usage
        (tenant_id, workspace_id, assistant_id, request_type, model, tokens_in, tokens_out, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          tenantId,
          workspaceId,
          assistantId,
          requestType,
          model,
          tokensIn,
          tokensOut,
          createdAt,
        ]
      );
    }
  } catch (err) {
    console.error("usageEmitter error:", err);
  }
});

export function emitUsageEvent(data) {
  usageEmitter.emit("usage", data);
}
