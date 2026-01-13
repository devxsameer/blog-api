// src/modules/auth/email-verification.service.ts
import * as TokenRepo from "./email-verification.repository.js";
import * as UserRepo from "@/modules/user/user.repository.js";
import { BadRequestError, NotFoundError } from "@/errors/http-errors.js";
import {
  generateEmailVerificationToken,
  hashEmailVerificationToken,
} from "./email-verification.utils.js";

const TOKEN_TTL = 30 * 60 * 1000; // 30 min

export async function issueEmailVerification(userId: string) {
  await TokenRepo.deleteExistingTokens(userId);

  const rawToken = generateEmailVerificationToken();
  const tokenHash = hashEmailVerificationToken(rawToken);

  await TokenRepo.createToken({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + TOKEN_TTL),
  });

  // 🔔 send email here (console/log for now)
  return rawToken;
}

export async function verifyEmail(token: string) {
  const tokenHash = hashEmailVerificationToken(token);

  const [record] = await TokenRepo.findValidToken(tokenHash);
  if (!record) {
    throw new BadRequestError("Invalid or expired verification token");
  }

  const [user] = await UserRepo.findUserById(record.userId);
  if (!user) throw new NotFoundError("User");

  if (user.emailVerifiedAt) {
    return user;
  }

  await TokenRepo.markTokenUsed(record.id);
  await UserRepo.markEmailVerified(user.id);

  return user;
}
