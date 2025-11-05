import dotenv from "dotenv";
import fs from "fs";
import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

let uploadedImageUrl;
let publicId;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function upload(filePath: any) {
  try {
    const options: UploadApiOptions = {
      use_filename: true,
      unique_filename: false,
      resource_type: "auto",
      transformation: [
        {
          quality: process.env.CLOUDINARY_QUALITY || "auto",
          fetch_format: "auto",
        },
      ],
    };

    const uploadToCloudinary = await cloudinary.uploader.upload(
      filePath,
      options
    );

    uploadedImageUrl = uploadToCloudinary.secure_url;
    publicId = uploadToCloudinary.public_id;

    // Delete the file asynchronously
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file at ${filePath}:`, err);
      } else {
        console.log(`Successfully deleted file at ${filePath}`);
      }
    });

    return { uploadedImageUrl, publicId };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function removeImageFromCloudinary(url: any) {
  try {
    const publicIdOfThumbURL = extractPublicIdFromUrl(url);
    await cloudinary.uploader.destroy(publicIdOfThumbURL);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function extractPublicIdFromUrl(url: string): string {
  const pathSegments: string[] | any = new URL(url).pathname.split("/");
  const publicId = pathSegments[pathSegments.length - 1].split(".")[0];
  return decodeURIComponent(publicId);
}
