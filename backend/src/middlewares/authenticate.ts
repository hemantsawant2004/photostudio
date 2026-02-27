import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/user";

type TokenPayload = {
  sub: number;
  email: string;
  role: "ADMIN" | "USER";
};

export type AuthenticatedRequest = Request & {
  user: User;
};

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, env.jwtSecret) as unknown as TokenPayload;
    const user = await User.findByPk(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

export async function authenticateOptional(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return next();
    }

    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, env.jwtSecret) as unknown as TokenPayload;
    const user = await User.findByPk(payload.sub);

    if (user) {
      (req as AuthenticatedRequest).user = user;
    }

    next();
  } catch {
    next();
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authenticatedRequest = req as AuthenticatedRequest;

  if (authenticatedRequest.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
}
