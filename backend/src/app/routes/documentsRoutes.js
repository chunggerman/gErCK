// backend/src/app/routes/documentsRoutes.js

import { Router } from "express";
import {
  createDocument,
  chunkDocument,
  embedDocument,
} from "../controllers/documentsController.js";

const router = Router();

router.post("/", createDocument);
router.post("/:id/chunk", chunkDocument);
router.post("/:id/embed", embedDocument);

export default router;
