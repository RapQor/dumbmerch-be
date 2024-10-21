import Joi from "joi";

export const purchaseSchema = Joi.object({
  userId: Joi.number().required(),
  productId: Joi.number().required(),
  quantity: Joi.number().required(),
}).unknown();
