// src/modules/auth/auth.routes.ts
import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "./auth.schema.js";
import { requireAuth } from "@/middlewares/auth.middleware.js";
import { authRateLimit } from "@/middlewares/rate-limit.middleware.js";

const authRoutes = Router();

authRoutes.post(
  "/signup",
  authRateLimit,
  validate(signupSchema),
  AuthController.signup
);
authRoutes.post(
  "/login",
  authRateLimit,
  validate(loginSchema),
  AuthController.login
);
authRoutes.post("/refresh", authRateLimit, AuthController.refresh);
authRoutes.post("/logout", requireAuth, AuthController.logout);

export default authRoutes;
