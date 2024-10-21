import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { NextFunction, Request, Response } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}

export const uploadCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const profile: CloudinaryFile = req.file as CloudinaryFile;
  if (!profile) {
    return res.status(400).send("No file uploaded");
  }

  const productPicture: CloudinaryFile = req.file as CloudinaryFile;

  const productPictures: CloudinaryFile[] = req.files as CloudinaryFile[];
  if (!productPicture && !productPictures) {
    return res.status(400).send("No file uploaded");
  }

  return uploadSingle(productPicture, res, next);
};

const uploadSingle = async (
  productPicture: CloudinaryFile,
  res: Response,
  next: NextFunction
) => {
  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "DUMBMERCH", // Sesuaikan dengan folder yang kamu inginkan
      } as any,
      (
        err: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          return res.status(500).send("Error uploading Product Picture");
        }
        if (!result) {
          console.error("Cloudinary upload error: Result is undefined");
          return res.status(500).send("Error uploading Product Picture");
        }

        res.locals.productPicture = result.secure_url;
        next();
      }
    );
    uploadStream.end(productPicture.buffer);
  } catch (error) {
    res.status(500).send("Error uploading Product Picture");
  }
};
