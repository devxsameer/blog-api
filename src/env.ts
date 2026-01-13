// src/env.ts
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("6969"),
  DATABASE_URL: z.url(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  DB_DRIVER: z.enum(["pg", "neon"]).default("neon"),
});

export const env = envSchema.parse(process.env);
