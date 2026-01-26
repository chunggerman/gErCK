// backend/src/app/services/workspaceService.js

import { WorkspaceRepositoryPostgres } from "../../repositories/postgres/workspaceRepositoryPostgres.js";
import { db } from "../../infra/db/client.js";

const repo = new WorkspaceRepositoryPostgres();

// Create workspace
export async function createWorkspace(data) {
  return repo.create(data);
}

// List workspaces
export async function listWorkspaces() {
  return repo.list();
}

// Get workspace by ID
export async function getWorkspace(id) {
  return repo.getById(id);
}

// Assistant CRUD (used by assistantController)
export async function createAssistant(data) {
  return repo.createAssistant(data);
}

export async function getAssistant(id) {
  return repo.getAssistant(id);
}

export async function updateAssistant(id, updates) {
  return repo.updateAssistant(id, updates);
}

// Workspace AI config
export async function getWorkspaceAIConfig(id) {
  const client = await db.connect();
  try {
    const result = await client.query(
      "SELECT ai_config FROM workspace WHERE id = $1",
      [id]
    );
    return result.rows[0]?.ai_config || null;
  } finally {
    client.release();
  }
}

export async function updateWorkspaceAIConfig(id, aiConfig) {
  const client = await db.connect();
  try {
    await client.query(
      "UPDATE workspace SET ai_config = $1 WHERE id = $2",
      [JSON.stringify(aiConfig), id]
    );
    return aiConfig;
  } finally {
    client.release();
  }
}
