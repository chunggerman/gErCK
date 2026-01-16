// backend/src/app/routes/contentRoutes.js

import express from "express";
import { uploadContent, searchContent } from "../controllers/contentController.js";

const router = express.Router();

router.post("/upload", uploadContent);
router.post("/search", searchContent);

export default router;
