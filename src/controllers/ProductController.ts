import { Request, Response } from "express";
import * as productService from "../services/ProductService";
import { productSchema } from "../libs/validations/product";
import { IProduct } from "../types/product";

export const createProduct = async (req: Request, res: Response) => {
  try {
    await productSchema.validateAsync(req.body);

    const productPicture = res.locals.productPicture;

    const newProduct: IProduct = {
      ...req.body,
      categoryId: parseInt(req.body.categoryId),
      productPicture: productPicture ? [{ url: productPicture }] : undefined,
    };

    const createdProduct = await productService.createProduct(newProduct);

    res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(Number(id));
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await productSchema.validateAsync(req.body);

    const productPicture = res.locals.productPicture;

    const updatedProductData: IProduct = {
      ...req.body,
      categoryId: parseInt(req.body.categoryId),
      productPicture: productPicture ? [{ url: productPicture }] : undefined,
    };

    if (productPicture) {
      updatedProductData.productPicture = [{ url: productPicture }];
    }

    const updatedProduct = await productService.updateProduct(
      parseInt(id),
      updatedProductData
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(Number(id));
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: `Failed to delete product: ${error.message}` });
    } else {
      res.status(500).json({
        error: "An unknown error occurred while deleting the product",
      });
    }
  }
};
