
// backend/src/routes/configRoutes.ts

import { Router } from "express";
import { getConfig, updateConfig, deleteConfig } from "../controllers/configController";

const router = Router();

router.get("/config", getConfig);
router.post("/config", updateConfig);
router.delete("/config", deleteConfig);


export default router;

