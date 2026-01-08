// src/config/cors.ts
import { env } from "@/env.js";

const DEV_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:6969",
  "http://127.0.0.1:6969",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const PROD_ORIGINS = [
  "https://blog.devxsameer.me",
  "https://dashboard.blog.devxsameer.me",
];

export const ALLOWED_ORIGINS =
  env.NODE_ENV === "production" ? PROD_ORIGINS : DEV_ORIGINS;
