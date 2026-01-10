// src/utils/jwt.ts
import { Role } from "@/constants/roles.js";
import { env } from "@/env.js";
import jwt from "jsonwebtoken";

export function signAccessToken(
  userId: string,
  role: string,
  isReadOnly: boolean
) {
  return jwt.sign({ sub: userId, role, isReadOnly }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
    sub: string;
    role: Role;
    isReadOnly: boolean;
  };
}
