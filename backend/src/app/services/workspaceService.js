// backend/src/app/services/workspaceService.js

import { db } from "../../infra/db/client.js";

async function getWorkspace(id) {
  const result = await db.query(
    `
    SELECT *
    FROM workspaces
    WHERE id = $1
    `,
    [id]
  );
  return result.rows[0] || null;
}

async function getAIConfig(id) {
  const result = await db.query(
    `
    SELECT ai_config
    FROM workspaces
    WHERE id = $1
    `,
    [id]
  );
  return result.rows[0]?.ai_config || null;
}

async function updateAIConfig(id, aiConfig) {
  const result = await db.query(
    `
    UPDATE workspaces
    SET ai_config = $1
    WHERE id = $2
    RETURNING *
    `,
    [aiConfig, id]
  );
  return result.rows[0] || null;
}

export default {
  getWorkspace,
  getAIConfig,
  updateAIConfig,
};
