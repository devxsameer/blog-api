// src/modules/auth/auth.schema.ts
import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(32),
    email: z.email(),
    password: z.string().min(8),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
