// backend/src/app/routes/referencesRoutes.js

import express from "express";
import {
  createReference,
  listReferences,
  getReference,
  updateReference,
  deleteReference,
} from "../controllers/referencesController.js";

const router = express.Router();

router.post("/", createReference);
router.get("/workspace/:workspaceId", listReferences);
router.get("/:id", getReference);
router.put("/:id", updateReference);
router.delete("/:id", deleteReference);

export default router;
