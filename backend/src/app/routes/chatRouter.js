// backend/src/app/routes/chatRouter.js

import express from "express";

import { handleChat, handleChatStream } from "../controllers/chatController.js";
import { handleDataChat } from "../controllers/dataChatController.js";

const router = express.Router();

/**
 * Unified Chat Router
 *
 * Routes:
 * - POST /rag        → hybrid RAG chat (semantic + tags)
 * - POST /stream     → streaming hybrid RAG chat
 * - POST /data       → data‑mode SQL Q&A
 * - POST /           → fallback to normal LLM chat (optional)
 */

// Hybrid RAG (semantic + tag)
router.post("/rag", handleChat);

// Streaming hybrid RAG
router.post("/stream", handleChatStream);

// Data‑mode SQL Q&A
router.post("/data", handleDataChat);

// Optional: pure LLM chat (no RAG, no SQL)
router.post("/", handleChat);

export default router;
