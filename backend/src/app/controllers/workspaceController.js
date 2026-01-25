// backend/src/app/controllers/workspaceController.js

import { WorkspaceRepositoryPostgres } from "../../repositories/postgres/workspaceRepositoryPostgres.js";
import { db } from "../../infra/db/client.js";

const repo = new WorkspaceRepositoryPostgres();

export const createWorkspace = async (req, res) => {
  const { name, description } = req.body;
  const workspace = await repo.create({ name, description });
  res.json(workspace);
};

export const listWorkspaces = async (req, res) => {
  const workspaces = await repo.list();
  res.json(workspaces);
};

export const getWorkspaceAIConfig = async (req, res) => {
  const { id } = req.params;
  const client = await db.connect();
  try {
    const result = await client.query(
      "SELECT ai_config FROM workspace WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Workspace not found" });
    }
    res.json(result.rows[0].ai_config);
  } finally {
    client.release();
  }
};

export const updateWorkspaceAIConfig = async (req, res) => {
  const { id } = req.params;
  const aiConfig = req.body;
  const client = await db.connect();
  try {
    await client.query(
      "UPDATE workspace SET ai_config = $1 WHERE id = $2",
      [JSON.stringify(aiConfig), id]
    );
    res.json({ success: true });
  } finally {
    client.release();
  }
};
