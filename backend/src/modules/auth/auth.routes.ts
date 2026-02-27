import { Router } from "express";
import { login, me, signup } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { loginSchema, signupSchema } from "./auth.schema";
import { authenticate } from "../../middlewares/authenticate";

export const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), signup);
authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/me", authenticate, me);
