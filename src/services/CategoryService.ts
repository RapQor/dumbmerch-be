import { Category } from "@prisma/client";
import db from "../libs/db";
import { ICategoryCreate } from "../types/category";
import ERROR from "../utils/constant/ERROR_LIST";

// Create a new category
export const createCategory = async (
  category: ICategoryCreate
): Promise<Category | string> => {
  const existedCategory = await db.category.findFirst({
    where: {
      categoryName: category.categoryName,
    },
  });

  if (existedCategory) {
    throw new Error("Category already exists");
  }

  const newCategory = await db.category.create({
    data: category,
  });

  console.log(newCategory);

  return newCategory;
};

export const getCategories = async (): Promise<Category[]> => {
  const categories = await db.category.findMany({
    include: {
      products: true,
    },
  });
  return categories;
};

// Get category by ID
export const getCategoryById = async (id: number): Promise<Category | null> => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new Error(ERROR.NOT_FOUND || "Category not found");
  }

  return category;
};

// Update category by ID
export const updateCategory = async (
  id: number,
  categoryName: string
): Promise<Category | string> => {
  const existedCategory = await db.category.findUnique({
    where: {
      id,
    },
  });

  if (!existedCategory) {
    throw new Error(ERROR.NOT_FOUND || "Category not found");
  }

  const updatedCategory = await db.category.update({
    where: {
      id,
    },
    data: {
      categoryName,
    },
  });

  return updatedCategory;
};

// Delete category by ID
export const deleteCategory = async (id: number): Promise<string> => {
  const existedCategory = await db.category.findUnique({
    where: {
      id,
    },
  });

  if (!existedCategory) {
    throw new Error(ERROR.NOT_FOUND || "Category not found");
  }

  await db.category.delete({
    where: {
      id,
    },
  });

  return "Category deleted successfully";
};
