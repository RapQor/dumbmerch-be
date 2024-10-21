import db from "../libs/db";
import { IProduct } from "../types/product";
import ERROR from "../utils/constant/ERROR_LIST";

export const createProduct = async (data: IProduct) => {
  return await db.products.create({
    data: {
      ...data,
      productPicture: {
        create:
          data.productPicture?.map((pic) => ({
            url: pic.url,
          })) || [],
      },
    },
    include: {
      productPicture: true,
      category: true,
    },
  });
};

export const getProducts = async () => {
  return await db.products.findMany({
    orderBy: { id: "desc" },
    include: {
      productPicture: {
        select: {
          url: true,
        },
      },
      category: true,
    },
  });
};

export const getProductById = async (id: number) => {
  return await db.products.findUnique({
    where: { id },
    include: {
      productPicture: true,
      category: true,
    },
  });
};

export const updateProduct = async (id: number, data: IProduct) => {
  return await db.products.update({
    where: { id },
    data: {
      ...data,
      productPicture: {
        create:
          data.productPicture?.map((pic: { url: string }) => ({
            url: pic.url,
          })) || [],
      },
    },
    include: {
      productPicture: true,
    },
  });
};

export const updateProductStock = async (id: number, quantity: number) => {
  const product = await db.products.findUnique({
    where: { id },
    select: { stock: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const newStock = Number(product.stock) - quantity;

  if (newStock < 0) {
    throw new Error("Insufficient stock");
  }

  return await db.products.update({
    where: { id },
    data: {
      stock: newStock.toString(),
    },
  });
};

export const deleteProduct = async (id: number) => {
  const existedProduct = await db.products.findUnique({
    where: { id },
    include: {
      productPicture: true,
      purchases: true,
    },
  });

  if (!existedProduct) {
    throw new Error(ERROR.NOT_FOUND || "Product not found");
  }

  await db.$transaction(async (prisma) => {
    // Delete related purchases
    if (existedProduct.purchases.length > 0) {
      await prisma.purchase.deleteMany({
        where: { productId: id },
      });
    }

    // Delete related product pictures
    if (existedProduct.productPicture.length > 0) {
      await prisma.productPicture.deleteMany({
        where: { productId: id },
      });
    }

    // Finally, delete the product
    await prisma.products.delete({
      where: { id },
    });
  });

  return "Product deleted successfully";
};
