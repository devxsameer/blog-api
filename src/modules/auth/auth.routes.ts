// src/modules/auth/auth.routes.ts
import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { validateBody } from "@/middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "./auth.schema.js";
import { requireAuth } from "@/middlewares/auth.middleware.js";
import { authRateLimit } from "@/middlewares/rate-limit.middleware.js";

const authRoutes = Router();

authRoutes.get("/me", requireAuth, AuthController.me);
authRoutes.post(
  "/signup",
  authRateLimit,
  validateBody(signupSchema),
  AuthController.signup
);
authRoutes.post(
  "/login",
  authRateLimit,
  validateBody(loginSchema),
  AuthController.login
);
authRoutes.post("/refresh", authRateLimit, AuthController.refresh);
authRoutes.post("/logout", requireAuth, AuthController.logout);

export default authRoutes;
