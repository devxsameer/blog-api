// src/utils/jwt.ts
import { env } from "@/env.js";
import jwt from "jsonwebtoken";

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

export const signRefreshToken = (payload: object) =>
  jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string, secret: string) =>
  jwt.verify(token, secret);
