import { Router } from "express";
import * as authController from "../controllers/AuthController";
import authorization from "../middlewares/authorization";

const authRoute = Router();

authRoute.post("/login", authController.login);
authRoute.post("/register", authController.register);
authRoute.get("/me", authorization, authController.checkAuth);
authRoute.get("/currentUser", authorization, authController.currentUser);
authRoute.get("/checkUser", authorization, authController.checkUser);

authRoute.post("/logout", authorization, authController.logout);

export default authRoute;
