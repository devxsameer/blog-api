// src/env.ts
import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("6969"),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
