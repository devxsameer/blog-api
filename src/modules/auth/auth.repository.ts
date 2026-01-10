// src/modules/auth/auth.repository.ts
import { db } from "@/db/index.js";
import { refreshTokensTable } from "@/db/schema/tokens.js";
import { and, eq, isNull } from "drizzle-orm";

export function saveRefreshToken(data: {
  userId: string;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}) {
  return db.insert(refreshTokensTable).values(data).returning();
}

export function findValidRefreshToken(tokenHash: string) {
  return db
    .select()
    .from(refreshTokensTable)
    .where(
      and(
        eq(refreshTokensTable.tokenHash, tokenHash),
        isNull(refreshTokensTable.revokedAt)
      )
    )
    .limit(1);
}

export function revokeRefreshToken(tokenHash: string) {
  return db
    .update(refreshTokensTable)
    .set({ lastUsedAt: new Date(), revokedAt: new Date() })
    .where(eq(refreshTokensTable.tokenHash, tokenHash));
}

export function revokeTokenFamily(familyId: string) {
  return db
    .update(refreshTokensTable)
    .set({ lastUsedAt: new Date(), revokedAt: new Date() })
    .where(eq(refreshTokensTable.familyId, familyId));
}

export function revokeAllUserTokens(userId: string) {
  return db
    .update(refreshTokensTable)
    .set({ lastUsedAt: new Date(), revokedAt: new Date() })
    .where(
      and(
        eq(refreshTokensTable.userId, userId),
        isNull(refreshTokensTable.revokedAt)
      )
    );
}
