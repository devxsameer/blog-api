// src/modules/auth/auth.service.ts
import { signAccessToken, signRefreshToken } from "@/utils/jwt.js";
import * as AuthRepo from "./auth.repository.js";
import { AppError } from "@/errors/app-error.js";
import crypto from "node:crypto";
import { hashPassword } from "@/utils/password.js";

export async function signup(
  username: string,
  email: string,
  password: string
) {
  const existing = await AuthRepo.findUserByEmail(email);

  if (existing.length) {
    throw new AppError(
      "An account with this email already exists.",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const passwordHash = await hashPassword(password);

  const [user] = await AuthRepo.createUser({ username, email, passwordHash });

  return issueTokens(user.id, user.role);
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function issueTokens(userId: string, role?: string) {
  const accessToken = signAccessToken(userId, role ?? "user");
  const refreshToken = signRefreshToken(userId);

  await AuthRepo.saveRefreshToken({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}
