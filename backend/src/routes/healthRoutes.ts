// backend/src/routes/healthRoutes.ts

import { Router } from "express";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

export default router;
