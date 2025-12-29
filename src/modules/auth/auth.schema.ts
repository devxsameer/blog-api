// src/modules/auth/auth.schema.ts
import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
