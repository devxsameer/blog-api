// src/modules/auth/auth.controller.ts
import { NextFunction, Request, Response } from "express";
import { LoginInput, SignupInput } from "./auth.schema.js";
import * as AuthService from "./auth.service.js";
import { refreshCookieOptions } from "@/utils/cookies.js";
import { sendResponse } from "@/utils/api-response.js";
import { UnauthorizedError } from "@/errors/http-errors.js";

export async function signup(req: Request, res: Response, _next: NextFunction) {
  const { username, email, password } = req.validated!
    .body as SignupInput["body"];

  const { user, tokens } = await AuthService.signup(username, email, password);

  res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

  return sendResponse(res, {
    statusCode: 201,
    message: "User account created successfully.",
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
    },
  });
}

export async function login(req: Request, res: Response, _next: NextFunction) {
  const { email, password } = req.validated!.body as LoginInput["body"];

  const { user, tokens } = await AuthService.login(email, password);

  res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

  return sendResponse(res, {
    message: "Logged in successfully.",
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
    },
  });
}

export async function refresh(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const token = req.cookies?.refreshToken;

  if (!token) throw new UnauthorizedError();

  const tokens = await AuthService.refresh(token);

  res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

  return sendResponse(res, {
    message: "Access token refreshed.",
    data: {
      accessToken: tokens.accessToken,
    },
  });
}

export async function logout(req: Request, res: Response, _next: NextFunction) {
  await AuthService.logout(req.user!.id);
  res.clearCookie("refreshToken", refreshCookieOptions);

  return sendResponse(res, {
    message: "Logged out successfully.",
  });
}
