import type { NextFunction, Request, Response } from "express";
import { PackageService } from "./package.service";
import type { CreatePackageInput } from "./package.schema";

export const getPackages = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const packages = await PackageService.getAll();
    res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
};

export const getAdminPackages = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const packages = await PackageService.getAdminAll();
    res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
};

export const createPackage = async (
  req: Request<{}, {}, CreatePackageInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const packageItem = await PackageService.create(req.body);
    res.status(201).json({ success: true, data: packageItem });
  } catch (err) {
    next(err);
  }
};
