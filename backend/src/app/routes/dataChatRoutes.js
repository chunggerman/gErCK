// backend/src/app/routes/dataChatRoutes.js

import express from "express";
import { handleDataChat } from "../controllers/dataChatController.js";

const router = express.Router();

// Natural‑language → SQL → execution → summarized answer
router.post("/", handleDataChat);

export default router;
