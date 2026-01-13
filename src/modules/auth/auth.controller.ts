// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { loginSchema, signupSchema } from "./auth.schema.js";
import * as AuthService from "./auth.service.js";
import { refreshCookieOptions } from "@/utils/cookies.js";
import { sendResponse } from "@/utils/api-response.js";
import { BadRequestError, UnauthorizedError } from "@/errors/http-errors.js";
import { findUserById } from "@/modules/user/user.repository.js";
import { verifyEmail } from "./email-verification.service.js";

function getMeta(req: Request) {
  return {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };
}

export async function signup(req: Request, res: Response) {
  const { username, email, password } = signupSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await AuthService.signup(
    username,
    email,
    password,
    getMeta(req)
  );

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return sendResponse(res, {
    statusCode: 201,
    message: "User account created successfully.",
    data: {
      user,
      accessToken: accessToken,
    },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await AuthService.login(
    email,
    password,
    getMeta(req)
  );

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return sendResponse(res, {
    message: "Logged in successfully.",
    data: {
      user,
      accessToken: accessToken,
    },
  });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;

  if (!token) throw new UnauthorizedError();

  const { accessToken, refreshToken } = await AuthService.refresh(
    token,
    getMeta(req)
  );

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return sendResponse(res, {
    message: "Access token refreshed.",
    data: {
      accessToken: accessToken,
    },
  });
}

export async function verifyEmailController(req: Request, res: Response) {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    throw new BadRequestError("Missing verification token");
  }

  await verifyEmail(token);

  return sendResponse(res, {
    message: "Email verified successfully",
  });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;

  if (token) {
    await AuthService.logout(token);
  }

  res.clearCookie("refreshToken", refreshCookieOptions);

  return sendResponse(res, {
    message: "Logged out successfully",
  });
}

export async function me(req: Request, res: Response) {
  const [user] = await findUserById(req.user!.id);

  return sendResponse(res, {
    message: "Authenticated user",
    data: {
      user,
    },
  });
}
