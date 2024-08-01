
// backend/src/routes/dataRoutes.ts

import { Router } from "express";
import { getLiveData, getHistoricalData } from "../controllers/dataController";

const router = Router();

router.get("/data/live/:symbol", getLiveData);
router.get("/data/historical/:symbol", getHistoricalData);

export default router;

