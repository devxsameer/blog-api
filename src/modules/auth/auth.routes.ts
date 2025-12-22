// src/modules/auth/auth.routes.ts
import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { signupSchema } from "./auth.schema.js";

const authRoutes = Router();

authRoutes.post("/signup", validate(signupSchema), AuthController.signup);

export default authRoutes;
