// backend/src/app/controllers/tenantsController.js

import { v4 as uuid } from "uuid";
import pool from "../../infra/db/pool.js";

export async function createTenant(req, res) {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "name is required" });
    }

    const existing = await pool.query(
      "SELECT id FROM tenants WHERE name = $1 LIMIT 1",
      [name]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Tenant name already exists" });
    }

    const id = uuid();

    await pool.query(
      "INSERT INTO tenants (id, name) VALUES ($1, $2)",
      [id, name]
    );

    return res.status(201).json({ id, name });
  } catch (err) {
    console.error("CREATE TENANT ERROR:", err);
    return res.status(500).json({ error: "Failed to create tenant" });
  }
}
