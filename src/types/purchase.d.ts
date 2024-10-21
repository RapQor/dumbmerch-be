import { Purchase } from "@prisma/client";

export interface IPurchase extends Omit<Purchase> {
  userId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
}
