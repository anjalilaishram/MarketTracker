
// backend/src/routes/index.ts

import { Router } from "express";
import configRoutes from "./configRoutes";
import dataRoutes from "./dataRoutes";

const router = Router();

router.use("/api", configRoutes);
router.use("/api", dataRoutes);

export default router;

