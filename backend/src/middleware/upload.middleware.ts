import multer, {
  FileFilterCallback,
} from "multer";

import { ApiError } from "../utils/ApiError.js";

const MAX_FILE_SIZE =
  50 * 1024 * 1024; // 50 MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File, 
  cb: FileFilterCallback
) => {
  if (
    ALLOWED_MIME_TYPES.includes(
      file.mimetype
    )
  ) {
    return cb(null, true);
  }

  cb(
    new ApiError(
      400,
      "Only PDF, JPG and PNG files are allowed"
    )
  );
};

export const upload = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
  },

  fileFilter,
});