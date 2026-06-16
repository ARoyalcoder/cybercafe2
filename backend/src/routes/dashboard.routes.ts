import { getDashboardStats, getRecentUploads} from "../controllers/dashboard.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.get(
  "/recent-uploads",
  verifyJWT,
  getRecentUploads
);
router.get(
  "/stats",
  verifyJWT,
  getDashboardStats
);
export default router;     