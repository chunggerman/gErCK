// backend/src/app/routes/assistantRoutes.js

import express from "express";
import {
  handleAssistantMessage,
  handleAssistantQuery
} from "../controllers/assistantController.js";

const router = express.Router();

router.post("/message", handleAssistantMessage);
router.post("/query", handleAssistantQuery);

export default router;
