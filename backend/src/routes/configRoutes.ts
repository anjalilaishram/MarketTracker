
// backend/src/routes/configRoutes.ts

import { Router } from "express";
import { getConfig, updateConfig } from "../controllers/configController";

const router = Router();

router.get("/config", getConfig);
router.post("/config", updateConfig);

export default router;

