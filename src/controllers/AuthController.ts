import { Request, Response } from "express";
import * as authService from "../services/AuthService";
import { IUserRegister } from "../types/auth";
import errorHandler from "../utils/errorHandler";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await authService.login(email, password);

    res.status(200).json({
      token: user,
    });
  } catch (error) {
    errorHandler(res, error as unknown as Error);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = await authService.register(body as IUserRegister);
    res.json(user);

    console.log(body);
  } catch (error) {
    console.log(error);
    errorHandler(res, error as unknown as Error);
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      address: user.address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const checkUser = async (req: Request, res: Response) => {
  try {
    const id = res.locals.user.id;
    const user = await authService.checkUser(id);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
