import { Router } from "express";

import { verifyJWT }
  from "../middleware/auth.middleware.js";

import {
  getUsage,
} from "../controllers/subscription.controller.js";

const router = Router();

router.get("/usage", verifyJWT, getUsage);

export default router;