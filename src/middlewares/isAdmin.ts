import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../libs/db";

interface JwtPayload {
  id: number;
}

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ error: "Access denied, no token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY! || "INIADALAHSECRETKEY"
    ) as JwtPayload;
    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied, admin only" });
    }

    // Jika user adalah admin, lanjutkan ke endpoint berikutnya
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
