// backend/src/app/routes/assistantRoutes.js

import { Router } from "express";
import {
  createAssistant,
  queryAssistant,
} from "../controllers/assistantController.js";

const router = Router();

router.post("/", createAssistant);
router.post("/:id/query", queryAssistant);

export default router;
