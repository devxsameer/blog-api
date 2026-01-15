// src/modules/auth/auth.service.ts
import { signAccessToken } from "@/utils/jwt.js";
import * as AuthRepo from "./auth.repository.js";
import * as UserRepo from "@/modules/user/user.repository.js";
import { ApiError } from "@/errors/api-error.js";
import { hashPassword, verifyPassword } from "@/utils/password.js";
import { UnauthorizedError } from "@/errors/http-errors.js";
import {
  generateFamilyId,
  generateOpaqueToken,
  hashToken,
} from "./auth.utils.js";
import { presentUser } from "../user/user.presenter.js";
import { issueEmailVerification } from "./email-verification.service.js";

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

export interface RequestMeta {
  ip?: string;
  userAgent?: string;
}

export async function signup(
  username: string,
  email: string,
  password: string,
  meta: RequestMeta
) {
  const existing = await UserRepo.findUserByEmail(email);

  if (existing.length) {
    throw new ApiError(
      "An account with this email already exists.",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const passwordHash = await hashPassword(password);

  const [user] = await UserRepo.createUser({ username, email, passwordHash });

  const verificationToken = await issueEmailVerification(user.id);

  console.log(
    `📧 Verify email: ${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
  );

  const familyId = generateFamilyId();
  const { accessToken, refreshToken } = await issueTokens(user, meta, familyId);

  return {
    user: presentUser(user),
    accessToken,
    refreshToken,
  };
}

export async function login(
  email: string,
  password: string,
  meta: RequestMeta
) {
  const [user] = await UserRepo.findUserByEmail(email);

  // Even if user is null, we verify against a dummy hash to prevent timing attacks.
  const passwordHash = user
    ? user.passwordHash
    : "$argon2id$v=19$m=64,t=3,p=1$OGNBTDk2TnhDam1MVzlSZQ$OwdkEUnPMH+OLJERLQzi7Q";
  const valid = await verifyPassword(passwordHash, password);

  if (!user || !valid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const familyId = generateFamilyId();
  const { accessToken, refreshToken } = await issueTokens(user, meta, familyId);

  return {
    user: presentUser(user),
    accessToken,
    refreshToken,
  };
}

export async function refresh(refreshToken: string, meta: RequestMeta) {
  const tokenHash = hashToken(refreshToken);

  const [stored] = await AuthRepo.findValidRefreshToken(tokenHash);

  if (!stored) throw new UnauthorizedError("Refresh token reuse detected");

  const [user] = await UserRepo.findUserById(stored.userId);
  if (!user || !user.isActive) {
    throw new UnauthorizedError();
  }

  await AuthRepo.revokeTokenFamily(stored.familyId);

  return issueTokens(user, meta, stored.familyId);
}

export async function logout(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  await AuthRepo.revokeRefreshToken(tokenHash);
}

async function issueTokens(user: any, meta: RequestMeta, familyId: string) {
  const accessToken = signAccessToken(user.id, user.role, user.isReadOnly);

  const refreshToken = generateOpaqueToken();

  await AuthRepo.saveRefreshToken({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    familyId: familyId,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return { accessToken, refreshToken };
}
