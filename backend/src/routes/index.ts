// backend/src/routes/index.ts

import { Router } from "express";
import configRoutes from "./configRoutes";
import dataRoutes from "./dataRoutes";
import healthRoutes from "./healthRoutes"; // Import the healthRoutes

const router = Router();

router.use("/api", configRoutes);
router.use("/api", dataRoutes);
router.use("/api", healthRoutes); // Use the healthRoutes

export default router;
