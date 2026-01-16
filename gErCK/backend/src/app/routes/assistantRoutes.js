// backend/src/app/routes/assistantRoutes.js

import express from "express";
import { answerQuestion } from "../controllers/assistantController.js";

const router = express.Router();

router.post("/answer", answerQuestion);

export default router;
