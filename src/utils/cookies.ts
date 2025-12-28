import { env } from "@/env.js";

const isProd = env.NODE_ENV === "production";
const sameSite = isProd ? ("none" as const) : ("lax" as const);

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite,
  path: "/api/auth/refresh",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
