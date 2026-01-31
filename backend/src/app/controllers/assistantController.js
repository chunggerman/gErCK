// backend/src/app/controllers/assistantController.js

import { v4 as uuid } from "uuid";
import pool from "../../infra/db/pool.js";

export async function createAssistant(req, res) {
  try {
    const { tenant_id, workspace_id, name, system_prompt } = req.body;

    if (!tenant_id || !workspace_id || !name || name.trim() === "") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const workspace = await pool.query(
      "SELECT id FROM workspaces WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [workspace_id, tenant_id]
    );

    if (workspace.rows.length === 0) {
      return res.status(400).json({ error: "invalid workspace_id" });
    }

    const existing = await pool.query(
      "SELECT id FROM assistants WHERE workspace_id = $1 AND name = $2 LIMIT 1",
      [workspace_id, name]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Assistant already exists" });
    }

    const id = uuid();

    await pool.query(
      `INSERT INTO assistants (id, tenant_id, workspace_id, name, system_prompt)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, tenant_id, workspace_id, name, system_prompt || ""]
    );

    return res.status(201).json({ id, tenant_id, workspace_id, name });
  } catch (err) {
    console.error("CREATE ASSISTANT ERROR:", err);
    return res.status(500).json({ error: "Failed to create assistant" });
  }
}

export async function queryAssistant(req, res) {
  try {
    const { id } = req.params;
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "query is required" });
    }

    const assistant = await pool.query(
      "SELECT id, name, system_prompt FROM assistants WHERE id = $1 LIMIT 1",
      [id]
    );

    if (assistant.rows.length === 0) {
      return res.status(400).json({ error: "invalid assistant id" });
    }

    return res.status(200).json({
      id,
      response: `Assistant '${assistant.rows[0].name}' received query: ${query}`,
    });
  } catch (err) {
    console.error("QUERY ASSISTANT ERROR:", err);
    return res.status(500).json({ error: "Failed to query assistant" });
  }
}
