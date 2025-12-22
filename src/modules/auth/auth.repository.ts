// src/modules/auth/auth.repository.ts
import { db } from "@/db/index.js";
import { refreshTokensTable } from "@/db/schema/tokens.js";
import { usersTable } from "@/db/schema/users.js";
import { and, eq, isNull } from "drizzle-orm";

export function findUserByEmail(email: string) {
  return db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.email, email),
        eq(usersTable.isActive, true),
        isNull(usersTable.deletedAt)
      )
    )
    .limit(1);
}

export function createUser(data: {
  username: string;
  email: string;
  passwordHash: string;
}) {
  return db.insert(usersTable).values(data).returning();
}

export function saveRefreshToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return db.insert(refreshTokensTable).values(data).returning();
}

export function findRefreshToken(tokenHash: string) {
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

export function revokeRefreshToken(id: string) {
  return db
    .update(refreshTokensTable)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokensTable.id, id));
}

export function revokeAllUserTokens(userId: string) {
  return db
    .update(refreshTokensTable)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(refreshTokensTable.userId, userId),
        isNull(refreshTokensTable.revokedAt)
      )
    );
}
