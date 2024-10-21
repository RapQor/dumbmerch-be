import { Request, Response, NextFunction } from "express";

export const validateCreateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryName } = req.body;

  // Cek apakah categoryName ada dan bukan string kosong
  if (
    !categoryName ||
    typeof categoryName !== "string" ||
    categoryName.trim() === ""
  ) {
    return res
      .status(400)
      .json({
        error: "Category name is required and must be a non-empty string",
      });
  }

  next(); // Jika valid, lanjutkan ke controller
};
