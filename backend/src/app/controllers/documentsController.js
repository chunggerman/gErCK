// backend/src/app/controllers/documentsController.js

import { v4 as uuid } from "uuid";
import pool from "../../infra/db/pool.js";

export async function createDocument(req, res) {
  try {
    const { tenant_id, workspace_id, name, content, tags, reference_id } =
      req.body;

    if (!tenant_id || !workspace_id || !name || !content) {
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
      "SELECT id FROM documents WHERE workspace_id = $1 AND name = $2 LIMIT 1",
      [workspace_id, name]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Document already exists" });
    }

    const id = uuid();

    await pool.query(
      `INSERT INTO documents
       (id, tenant_id, workspace_id, reference_id, name, content, tags, chunked, embedded)
       VALUES ($1, $2, $3, $4, $5, $6, $7, false, false)`,
      [
        id,
        tenant_id,
        workspace_id,
        reference_id || null,
        name,
        content,
        Array.isArray(tags) ? tags : [],
      ]
    );

    return res.status(201).json({
      id,
      tenant_id,
      workspace_id,
      name,
      content,
    });
  } catch (err) {
    console.error("CREATE DOCUMENT ERROR:", err);
    return res.status(500).json({ error: "Failed to create document" });
  }
}

export async function chunkDocument(req, res) {
  try {
    const { id } = req.params;

    const doc = await pool.query(
      "SELECT id, chunked FROM documents WHERE id = $1 LIMIT 1",
      [id]
    );

    if (doc.rows.length === 0) {
      return res.status(400).json({ error: "invalid document id" });
    }

    if (doc.rows[0].chunked) {
      return res.status(409).json({ error: "Document already chunked" });
    }

    await pool.query(
      "UPDATE documents SET chunked = true WHERE id = $1",
      [id]
    );

    return res.status(200).json({ id });
  } catch (err) {
    console.error("CHUNK DOCUMENT ERROR:", err);
    return res.status(500).json({ error: "Failed to chunk document" });
  }
}

export async function embedDocument(req, res) {
  try {
    const { id } = req.params;

    const doc = await pool.query(
      "SELECT id, chunked, embedded FROM documents WHERE id = $1 LIMIT 1",
      [id]
    );

    if (doc.rows.length === 0) {
      return res.status(400).json({ error: "invalid document id" });
    }

    if (!doc.rows[0].chunked) {
      return res
        .status(409)
        .json({ error: "Document must be chunked first" });
    }

    if (doc.rows[0].embedded) {
      return res.status(409).json({ error: "Document already embedded" });
    }

    await pool.query(
      "UPDATE documents SET embedded = true WHERE id = $1",
      [id]
    );

    return res.status(200).json({ id });
  } catch (err) {
    console.error("EMBED DOCUMENT ERROR:", err);
    return res.status(500).json({ error: "Failed to embed document" });
  }
}
