// src/middlewares/rate-limit.middleware.ts
import rateLimit from "express-rate-limit";
import { env } from "@/env.js";

const isProd = env.NODE_ENV === "production";

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message:
          options.message ?? "Too many requests, please try again later.",
      },
    },
    skip: () => !isProd, // 🚀 no rate limiting in dev
  });
}

// Auth endpoints (STRICT)
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: "Too many auth attempts. Please try later.",
});

// Public read endpoints (SOFT)
export const publicReadRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 min
  max: 120,
});

// Mutating actions (likes, comments)
export const writeRateLimit = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
});
