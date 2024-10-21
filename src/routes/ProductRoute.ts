import { Router } from "express";
import * as ProductController from "../controllers/ProductController";
import { isAdmin } from "../middlewares/isAdmin";
import upload from "../middlewares/fileUpload";
import { uploadCloudinary } from "../middlewares/cloudinary";
import authorization from "../middlewares/authorization";

const ProductRoute = Router();

ProductRoute.post(
  "/products",
  authorization,
  isAdmin,
  upload.single("productPicture"),
  uploadCloudinary,
  ProductController.createProduct
);
ProductRoute.get("/products", authorization, ProductController.getProducts);
ProductRoute.get(
  "/products/:id",
  authorization,
  ProductController.getProductById
);
ProductRoute.put(
  "/products/:id",
  authorization,
  isAdmin,
  upload.single("productPicture"),
  uploadCloudinary,
  ProductController.updateProduct
);
ProductRoute.delete("/products/:id", isAdmin, ProductController.deleteProduct);

export default ProductRoute;
