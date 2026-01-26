import express from "express";
import {
  handleChat,
  handleChatStream
} from "../controllers/chatController.js";

const router = express.Router();

// Non‑streaming chat
router.post("/", handleChat);

// Streaming chat
router.post("/stream", handleChatStream);

export default router;
