// src/modules/auth/auth.service.ts
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt.js";
import * as AuthRepo from "./auth.repository.js";
import { ApiError } from "@/errors/api-error.js";
import crypto from "node:crypto";
import { hashPassword, verifyPassword } from "@/utils/password.js";
import { UnauthorizedError } from "@/errors/http-errors.js";

export async function signup(
  username: string,
  email: string,
  password: string
) {
  const existing = await AuthRepo.findUserByEmail(email);

  if (existing.length) {
    throw new ApiError(
      "An account with this email already exists.",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const passwordHash = await hashPassword(password);

  const [user] = await AuthRepo.createUser({ username, email, passwordHash });
  const tokens = await issueTokens(user.id, user.isReadOnly, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isReadOnly: user.isReadOnly,
    },
    tokens,
  };
}

export async function login(email: string, password: string) {
  const [user] = await AuthRepo.findUserByEmail(email);

  // Even if user is null, we verify against a dummy hash to prevent timing attacks.
  const passwordHash = user
    ? user.passwordHash
    : "$argon2id$v=19$m=64,t=3,p=1$OGNBTDk2TnhDam1MVzlSZQ$OwdkEUnPMH+OLJERLQzi7Q";
  const valid = await verifyPassword(passwordHash, password);

  if (!user || !valid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const tokens = await issueTokens(user.id, user.isReadOnly, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isReadOnly: user.isReadOnly,
    },
    tokens,
  };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const [stored] = await AuthRepo.findValidRefreshToken(tokenHash);

  if (!stored) throw new UnauthorizedError();

  const [user] = await AuthRepo.findUserById(payload.sub);
  if (!user || !user.isActive) {
    throw new UnauthorizedError();
  }

  await AuthRepo.revokeRefreshToken(tokenHash);

  return issueTokens(user.id, user.isReadOnly, user.role);
}

export async function logout(userId: string) {
  await AuthRepo.revokeAllUserTokens(userId);
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function issueTokens(userId: string, isReadOnly: boolean, role?: string) {
  const accessToken = signAccessToken(userId, role ?? "user", isReadOnly);
  const refreshToken = signRefreshToken(userId);

  await AuthRepo.saveRefreshToken({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}
