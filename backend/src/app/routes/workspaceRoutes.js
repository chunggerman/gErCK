import express from "express";
import {
  createWorkspace,
  listWorkspaces,
  getWorkspaceAIConfig,
  updateWorkspaceAIConfig
} from "../controllers/workspaceController.js";

const router = express.Router();

// Create workspace
router.post("/", createWorkspace);

// List all workspaces
router.get("/", listWorkspaces);

// Get workspace AI config
router.get("/:id/ai-config", getWorkspaceAIConfig);

// Update workspace AI config
router.put("/:id/ai-config", updateWorkspaceAIConfig);

export default router;
