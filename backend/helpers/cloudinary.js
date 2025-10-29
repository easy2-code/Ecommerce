// helpers/cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dpeg4m7iz",
  api_key: "178434568471571",
  api_secret: "KVK1xsi-WPUGf_mHtCvq5ChrzC8",
});

// Use memory storage so file buffer is accessible in controller
export const upload = multer({ storage: multer.memoryStorage() });

export async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return result;
}
