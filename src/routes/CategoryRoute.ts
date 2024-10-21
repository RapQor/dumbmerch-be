import { Router } from "express";
import * as categoryController from "../controllers/CategoryController";
import { isAdmin } from "../middlewares/isAdmin";
import { validateCreateCategory } from "../middlewares/validateCreateCategory";

const CategoryRoute = Router();

CategoryRoute.post(
  "/categories",
  isAdmin,
  validateCreateCategory,
  categoryController.createCategory
);
CategoryRoute.get("/categories", isAdmin, categoryController.getCategories);
CategoryRoute.get(
  "/categories/:id",
  isAdmin,
  categoryController.getCategoryById
);
CategoryRoute.put(
  "/categories/:id",
  isAdmin,
  validateCreateCategory,
  categoryController.updateCategory
);
CategoryRoute.delete(
  "/categories/:id",
  isAdmin,
  categoryController.deleteCategory
);

export default CategoryRoute;
