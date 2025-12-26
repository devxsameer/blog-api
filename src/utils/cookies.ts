import { env } from "@/env.js";

export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "none",
  path: "/auth/refresh",
};
