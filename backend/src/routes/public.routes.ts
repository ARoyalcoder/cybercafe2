import { Router } from "express";

import { uploadCustomerFile } from "../controllers/public.controller.js";

import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// router.post("/upload/:slug", upload.single("file"), uploadCustomerFile);
router.post("/upload/:slug", upload.array("files", 20), uploadCustomerFile);

export default router;