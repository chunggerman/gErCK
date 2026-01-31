// backend/src/app/controllers/workspaceController.js

import { v4 as uuid } from "uuid";
import pool from "../../infra/db/pool.js";

export async function createWorkspace(req, res) {
  try {
    const { tenant_id, name } = req.body;

    if (!tenant_id || !name || name.trim() === "") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const tenant = await pool.query(
      "SELECT id FROM tenants WHERE id = $1 LIMIT 1",
      [tenant_id]
    );

    if (tenant.rows.length === 0) {
      return res.status(400).json({ error: "invalid tenant_id" });
    }

    const existing = await pool.query(
      "SELECT id FROM workspaces WHERE tenant_id = $1 AND name = $2 LIMIT 1",
      [tenant_id, name]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Workspace already exists" });
    }

    const id = uuid();

    await pool.query(
      "INSERT INTO workspaces (id, tenant_id, name) VALUES ($1, $2, $3)",
      [id, tenant_id, name]
    );

    return res.status(201).json({ id, tenant_id, name });
  } catch (err) {
    console.error("CREATE WORKSPACE ERROR:", err);
    return res.status(500).json({ error: "Failed to create workspace" });
  }
}
