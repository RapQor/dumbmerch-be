import { Products } from "@prisma/client";

export interface IProduct extends Omit<Products, "productPicture"> {
  productPicture?: { url: string }[];
}
