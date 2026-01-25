// backend/src/app/routes/contentRoutes.js

import express from "express";
import { searchContent } from "../controllers/contentController.js";

const router = express.Router();

router.post("/search", searchContent);

export default router;
