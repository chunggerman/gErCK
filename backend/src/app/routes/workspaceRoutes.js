// backend/src/app/routes/workspaceRoutes.js

import { Router } from "express";
import { createWorkspace } from "../controllers/workspaceController.js";

const router = Router();

router.post("/", createWorkspace);

export default router;
