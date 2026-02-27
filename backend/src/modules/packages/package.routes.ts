import { Router } from "express";
import { createPackage, getAdminPackages, getPackages } from "./package.controller";
import { validate } from "../../middlewares/validate";
import { createPackageSchema } from "./package.schema";
import { authenticate, requireAdmin } from "../../middlewares/authenticate";

export const packageRouter = Router();

packageRouter.get("/", getPackages);
packageRouter.get("/admin", authenticate, requireAdmin, getAdminPackages);
packageRouter.post("/", authenticate, requireAdmin, validate(createPackageSchema), createPackage);
