import multer from "multer";

// Menggunakan memory storage agar file disimpan di memori sebelum diunggah ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

export default upload;
