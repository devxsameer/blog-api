// src/middlewares/cors.middlewares.ts
import cors from "cors";
import { ALLOWED_ORIGINS } from "@/config/cors.js";

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Allow non-browser clients (Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],

  exposedHeaders: ["X-Request-Id"],

  maxAge: 86400, // cache preflight for 24h
});
