// src/utils/jwt.ts
import { env } from "@/env.js";
import { Role } from "@/types/auth.js";
import jwt from "jsonwebtoken";

export function signAccessToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
    sub: string;
    role: Role;
  };
}
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as {
    sub: string;
  };
}
