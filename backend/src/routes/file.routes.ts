import { compressPdf, downloadFile } from "../controllers/file.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
const router = Router();

router.get(
    "/download/:id",
    verifyJWT , 
    downloadFile
);

router.post(
    "/compress/:id",
    verifyJWT,
    compressPdf
);
// router.post(
//   "/compress-image/:id",
//   verifyJWT,
//   compressImage
// );

export default router; 