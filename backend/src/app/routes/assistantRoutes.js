import express from "express";
import {
  createAssistant,
  getAssistant,
  updateAssistant
} from "../controllers/assistantController.js";

const router = express.Router();

// Builder endpoints
router.post("/", createAssistant);
router.get("/:id", getAssistant);
router.put("/:id", updateAssistant);

export default router;
