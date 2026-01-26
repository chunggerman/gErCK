import { WorkspaceRepositoryPostgres } from "../../repositories/postgres/workspaceRepositoryPostgres.js";
import { db } from "../../infra/db/client.js";

const repo = new WorkspaceRepositoryPostgres();

export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const workspace = await repo.create({ name, description });
    res.json({ workspace });
  } catch (err) {
    console.error("createWorkspace error:", err);
    res.status(500).json({ error: "Failed to create workspace" });
  }
};

export const listWorkspaces = async (req, res) => {
  try {
    const workspaces = await repo.list();
    res.json({ workspaces });
  } catch (err) {
    console.error("listWorkspaces error:", err);
    res.status(500).json({ error: "Failed to list workspaces" });
  }
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
    res.json({ aiConfig: result.rows[0].ai_config });
  } catch (err) {
    console.error("getWorkspaceAIConfig error:", err);
    res.status(500).json({ error: "Failed to fetch workspace AI config" });
  } finally
