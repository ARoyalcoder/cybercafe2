import { Router } from "express";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/users", verifyJWT, async (req, res) => {
  const users = await User.find();

  res.json(users);
});

export default router;