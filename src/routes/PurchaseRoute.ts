import { Router } from "express";
import * as PurchaseController from "../controllers/PurchaseController";
import upload from "../middlewares/fileUpload";

const PurchaseRoute = Router();

PurchaseRoute.post(
  "/purchases",
  upload.none(),
  PurchaseController.createPurchase
);
PurchaseRoute.get("/purchases", PurchaseController.getPurchases);
PurchaseRoute.get("/purchases/:id", PurchaseController.getPurchaseById);
PurchaseRoute.get(
  "/purchases/user/:userId",
  PurchaseController.getPurchaseByUserId
);
PurchaseRoute.delete("/purchases/:id", PurchaseController.deletePurchase);

export default PurchaseRoute;
