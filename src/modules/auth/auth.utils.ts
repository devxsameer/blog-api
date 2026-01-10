// src/modules/auth/auth.utils.ts
import crypto from "node:crypto";

export function generateOpaqueToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateFamilyId(): string {
  return crypto.randomUUID();
}
