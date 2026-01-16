import express from "express";
import { createWorkspace, listWorkspaces, getWorkspaceAIConfig, updateWorkspaceAIConfig } from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/", createWorkspace);
router.get("/", listWorkspaces);
router.get("/:id/ai-config", getWorkspaceAIConfig);
router.put("/:id/ai-config", updateWorkspaceAIConfig);

export default router;
