// src/utils/logger.ts
import { env } from "@/env.js";
import pino from "pino";

const isProd = env.NODE_ENV === "production";

export const logger = pino({
  level: isProd ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "refreshToken",
    ],
    remove: true,
  },
  transport: !isProd
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});