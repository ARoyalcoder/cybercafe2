import { Router } from "express";
import passport from "../config/passport.js";

import {
  getProfile,
  googleSuccess,
  logout,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = passport.authenticate("google", {
  session: false,
});

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback, googleSuccess);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getProfile);
export default router;