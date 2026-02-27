import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import type { LoginInput, SignupInput } from "./auth.schema";
import type { AuthenticatedRequest } from "../../middlewares/authenticate";

export const signup = async (
  req: Request<{}, {}, SignupInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AuthService.signup(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AuthService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    res.json({
      success: true,
      data: AuthService.getCurrentUser(authenticatedRequest.user),
    });
  } catch (err) {
    next(err);
  }
};
