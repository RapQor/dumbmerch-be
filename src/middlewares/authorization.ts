import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify token
    const payload = jwt.verify(token, process.env.SECRET_KEY || "secret", {
      algorithms: ["HS256"],
    }) as jwt.JwtPayload;

    // If the payload is valid, set user in res.locals
    res.locals.user = payload;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or expired token
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
