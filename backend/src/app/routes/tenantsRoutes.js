// backend/src/app/routes/tenantsRoutes.js

import { Router } from "express";
import { createTenant } from "../controllers/tenantsController.js";

const router = Router();

router.post("/", createTenant);

export default router;
