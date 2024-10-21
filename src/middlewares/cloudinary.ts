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
  console.log("uploading");

  const profile: CloudinaryFile = req.file as CloudinaryFile;
  if (!profile) {
    return res.status(400).send("No file uploaded");
  }

  const productPicture: CloudinaryFile = req.file as CloudinaryFile;

  console.log("ini productPicture= ", productPicture);

  const productPictures: CloudinaryFile[] = req.files as CloudinaryFile[];
  if (!productPicture && !productPictures) {
    return res.status(400).send("No file uploaded");
  }

  if (productPicture) {
    return uploadSingle(productPicture, res, next);
  } else {
    return uploadMultiple(productPictures, res, next);
  }
};

const uploadMultiple = async (
  productPictures: CloudinaryFile[],
  res: Response,
  next: NextFunction
) => {
  try {
    const cloudinaryUrls: string[] = [];
    for (const productPicture of productPictures) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "DUMBMERCH",
        } as any,
        (
          err: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (err) {
            console.error("Cloudinary upload error:", err);
            return next(err);
          }
          if (!result) {
            console.error("Cloudinary upload error: Result is undefined");
            return next(new Error("Cloudinary upload result is undefined"));
          }
          cloudinaryUrls.push(result.secure_url);

          if (cloudinaryUrls.length === productPictures.length) {
            res.locals.productPictures = cloudinaryUrls;
            next();
          }
        }
      );
      uploadStream.end(productPicture.buffer);
    }
  } catch (error) {
    console.error("Error in uploadToCloudinary middleware:", error);
    next(error);
  }
};

const uploadSingle = async (
  productPicture: CloudinaryFile,
  res: Response,
  next: NextFunction
) => {
  try {
    cloudinary.uploader
      .upload_stream(
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
        }
      )
      .end(productPicture.buffer);
    next();
  } catch (error) {
    console.log("Error in uploadToCloudinary middleware:", error);
    res.status(500).send("Error uploading Product Picture");
  }
};
