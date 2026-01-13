// src/modules/auth/email-verification.utils.ts
import crypto from "node:crypto";

export function generateEmailVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashEmailVerificationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
