import Joi from "joi";

export const productSchema = Joi.object({
  productName: Joi.string().required(),
  stock: Joi.number().required(),
  specification: Joi.string().required(),
  detail: Joi.string().required(),
  price: Joi.number().required(),
  categoryId: Joi.number().required(),
  productPicture: Joi.any().optional(),
}).unknown();
