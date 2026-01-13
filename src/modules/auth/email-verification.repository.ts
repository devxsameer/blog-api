// src/modules/auth/email-verification.repository.ts
import { db } from "@/db/index.js";
import { emailVerificationTokensTable } from "@/db/schema/email-verification.js";
import { and, eq, isNull, gt } from "drizzle-orm";

export function createToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return db.insert(emailVerificationTokensTable).values(data).returning();
}

export function findValidToken(tokenHash: string) {
  return db
    .select()
    .from(emailVerificationTokensTable)
    .where(
      and(
        eq(emailVerificationTokensTable.tokenHash, tokenHash),
        isNull(emailVerificationTokensTable.usedAt),
        gt(emailVerificationTokensTable.expiresAt, new Date())
      )
    )
    .limit(1);
}

export function markTokenUsed(id: string) {
  return db
    .update(emailVerificationTokensTable)
    .set({ usedAt: new Date() })
    .where(eq(emailVerificationTokensTable.id, id));
}

export function deleteExistingTokens(userId: string) {
  return db
    .delete(emailVerificationTokensTable)
    .where(eq(emailVerificationTokensTable.userId, userId));
}
