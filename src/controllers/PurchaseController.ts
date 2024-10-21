import { Request, Response } from "express";
import * as purchaseService from "../services/PurchaseService";
import { IPurchase } from "../types/purchase";
import { purchaseSchema } from "../libs/validations/purchase";

export const createPurchase = async (req: Request, res: Response) => {
  try {
    await purchaseSchema.validateAsync(req.body);

    const newPurchase: IPurchase = {
      ...req.body,
      userId: Number(req.body.userId),
      productId: Number(req.body.productId),
      quantity: Number(req.body.quantity),
    };

    const createdPurchase = await purchaseService.createPurchase(newPurchase);
    res.status(201).json({
      message: "Purchase created successfully",
      purchase: createdPurchase,
      totalPrice: createdPurchase.totalPrice,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Insufficient stock") {
        res.status(400).json({ error: "Insufficient stock" });
      } else if (error.message === "Product not found") {
        res.status(404).json({ error: "Product not found" });
      } else {
        res.status(500).json({ error: "Failed to create purchase" });
      }
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await purchaseService.getPurchases();
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve purchases" });
  }
};

export const getPurchaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchase = await purchaseService.getPurchaseById(Number(id));
    if (purchase) {
      res.status(200).json(purchase);
    } else {
      res.status(404).json({ error: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve purchase" });
  }
};

export const getPurchaseByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const purchases = await purchaseService.getPurchaseByUserId(Number(userId));

    if (purchases.length > 0) {
      res.status(200).json(purchases);
    } else {
      res.status(404).json({ error: "No purchases found for this user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve purchases" });
  }
};

export const deletePurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await purchaseService.deletePurchase(Number(id));
    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete purchase" });
  }
};
