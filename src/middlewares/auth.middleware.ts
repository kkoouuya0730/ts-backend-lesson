import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
  id: number;
  email: string;
};

export const authMiddleware = (req: Request, res: Response, _next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
