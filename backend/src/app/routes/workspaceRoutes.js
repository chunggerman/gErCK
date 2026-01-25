// backend/src/app/routes/workspaceRoutes.js

import express from "express";
import {
  getWorkspaceSettings,
  updateWorkspaceSettings
} from "../services/workspaceService.js";

const router = express.Router();

router.get("/:workspaceId/settings", (req, res) => {
  const { workspaceId } = req.params;
  const settings = getWorkspaceSettings(workspaceId);
  res.json(settings);
});

router.put("/:workspaceId/settings", (req, res) => {
  const { workspaceId } = req.params;
  const newSettings = req.body;
  const updated = updateWorkspaceSettings(workspaceId, newSettings);
  res.json(updated);
});

export default router;
