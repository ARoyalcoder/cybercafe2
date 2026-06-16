import { Router } from "express";

import {
  deleteFolder,
  deleteMultipleFolders,
  getMyFolders,
  getFolderDetails,
  updateFolderStatus,
} from "../controllers/folder.controller.js";
import { toggleUploadPermission } from "../controllers/public.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getMyFolders);
router.patch("/:id/status", updateFolderStatus);
router.patch("/upload-permission", toggleUploadPermission);
router.delete("/bulk-delete", deleteMultipleFolders);
router.delete("/:id", deleteFolder);
router.get("/:id", verifyJWT, getFolderDetails);


export default router;