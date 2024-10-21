import { Router } from "express";
import authRoute from "./AuthRoute";
import CategoryRoute from "./CategoryRoute";
import ProductRoute from "./ProductRoute";
import PurchaseRoute from "./PurchaseRoute";

const route = Router();

route.use("/auth", authRoute);
route.use("/admin", CategoryRoute);
route.use("/purchases", PurchaseRoute);
route.use("/products", ProductRoute);

export default route;
