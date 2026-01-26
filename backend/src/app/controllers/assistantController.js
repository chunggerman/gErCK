// backend/src/app/controllers/assistantController.js

import workspaceService from "../services/workspaceService.js";

/**
 * POST /api/assistants
 * Create a new assistant for a workspace
 */
export async function createAssistant(req, res) {
  try {
    const { workspaceId, name, description, instructions, messageOverrides, model } = req.body;

    if (!workspaceId || !name) {
      return res.status(400).json({ error: "workspaceId and name are required" });
    }

    const assistant = await workspaceService.createAssistant({
      workspaceId,
      name,
      description: description || "",
      instructions: instructions || "",
      messageOverrides: messageOverrides || {},
      model: model || "gpt-4o-mini"
    });

    return res.json({ assistant });
  } catch (err) {
    console.error("createAssistant error:", err);
    return res.status(500).json({ error: "Failed to create assistant" });
  }
}

/**
 * GET /api/assistants/:id
 * Fetch assistant details
 */
export async function getAssistant(req, res) {
  try {
    const { id } = req.params;

    const assistant = await workspaceService.getAssistant(id);
    if (!assistant) {
      return res.status(404).json({ error: "Assistant not found" });
    }

    return res.json({ assistant });
  } catch (err) {
    console.error("getAssistant error:", err);
    return res.status(500).json({ error: "Failed to fetch assistant" });
  }
}

/**
 * PUT /api/assistants/:id
 * Update assistant configuration
 */
export async function updateAssistant(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const assistant = await workspaceService.updateAssistant(id, updates);
    if (!assistant) {
      return res.status(404).json({ error: "Assistant not found" });
    }

    return res.json({ assistant });
  } catch (err) {
    console.error("updateAssistant error:", err);
    return res.status(500).json({ error: "Failed to update assistant" });
  }
}
