import db from "../libs/db";
import { IPurchase } from "../types/purchase";
import * as productService from "./ProductService";

export const createPurchase = async (data: IPurchase) => {
  return await db.$transaction(async (db) => {
    // Get the product to calculate the total price
    const product = await db.products.findUnique({
      where: { id: data.productId },
      select: { price: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Calculate total price
    const totalPrice = Number(product.price) * data.quantity;

    // Create the purchase with calculated total price
    const purchase = await db.purchase.create({
      data: {
        ...data,
        totalPrice,
      },
      include: {
        product: true,
        user: true,
      },
    });

    // Update the product stock
    await productService.updateProductStock(data.productId, data.quantity);

    return purchase;
  });
};

export const getPurchases = async () => {
  return await db.purchase.findMany({
    include: {
      product: true,
      user: true,
    },
  });
};

export const getPurchaseById = async (id: number) => {
  return await db.purchase.findUnique({
    where: { id },
    include: {
      product: true,
      user: true,
    },
  });
};

export const getPurchaseByUserId = async (userId: number) => {
  return await db.purchase.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          productPicture: true,
        },
      },
      user: true,
    },
  });
};

export const deletePurchase = async (id: number) => {
  return await db.purchase.delete({
    where: { id },
  });
};
