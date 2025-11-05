import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "application/pdf",
  "text/plain",
  "application/msword", // for .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // for .docx
  // Audio / Music formats
  "audio/mpeg", // .mp3
  "audio/wav", // .wav
  "audio/x-wav",
  "audio/x-m4a", // .m4a
  "audio/aac", // .aac
  "audio/flac", // .flac
  "audio/ogg", // .ogg
  "audio/webm", // .webm audio
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, PNG, and WEBP images are allowed!"));
};

const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 5MB max
  fileFilter,
});

export default uploadImage;
