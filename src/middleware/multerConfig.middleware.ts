import multer from "multer";
import path from "path";
import type { FileFilterCallback } from "multer";
import type { Request } from "express";

const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  const validExtensions = [".jpeg", ".jpg", ".png"]; // Included '.jpg' explicitly
  const extension = path.extname(file.originalname).toLowerCase();

  if (!validExtensions.includes(extension)) {
    const error: any = new Error(
      `Unsupported file type: ${extension}. Only the following extensions are allowed: ${validExtensions.join(
        ", "
      )}`
    );
    error.code = "LIMIT_FILE_TYPES";
    return callback(error, false);
  }

  // File is valid
  callback(null, true);
};

const imageLimit = {
  fileSize: 50 * 1024 * 1024, // 50 MB
};

export const uploadMem = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: imageLimit,
}).fields([{ name: "profilePicture", maxCount: 1 }]);

export const upload = multer({ dest: "uploads/", limits: imageLimit });
