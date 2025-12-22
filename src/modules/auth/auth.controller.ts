// src/modules/auth/auth.controller.ts
import { NextFunction, Request, Response } from "express";
import { SignupInput } from "./auth.schema.js";
import * as AuthService from "./auth.service.js";
import { refreshCookieOptions } from "@/utils/cookies.js";

export async function signup(req: Request, res: Response, next: NextFunction) {
  const { username, email, password } = req.validated!
    .body as SignupInput["body"];

  const tokens = await AuthService.signup(username, email, password);

  res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);
  res.status(201).json({ accessToken: tokens.accessToken });
}
