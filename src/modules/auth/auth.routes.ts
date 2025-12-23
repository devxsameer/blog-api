// src/modules/auth/auth.routes.ts
import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "./auth.schema.js";
import { requireAuth } from "@/middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", validate(signupSchema), AuthController.signup);
authRoutes.post("/login", validate(loginSchema), AuthController.login);
authRoutes.post("/refresh", AuthController.refresh);
authRoutes.post("/logout", requireAuth, AuthController.logout);

export default authRoutes;
