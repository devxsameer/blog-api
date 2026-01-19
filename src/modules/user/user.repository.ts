// src/modules/user/user.respository.ts
import { db } from "@/db/index.js";
import { usersTable } from "@/db/schema/users.js";
import { and, desc, eq, isNull, lt } from "drizzle-orm";

export function findUserById(id: string) {
  return db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.id, id),
        eq(usersTable.isActive, true),
        isNull(usersTable.deletedAt),
      ),
    )
    .limit(1);
}

export function findUserByEmail(email: string) {
  return db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.email, email),
        eq(usersTable.isActive, true),
        isNull(usersTable.deletedAt),
      ),
    )
    .limit(1);
}

export function markEmailVerified(userId: string) {
  return db
    .update(usersTable)
    .set({
      emailVerifiedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, userId))
    .returning();
}

export function createUser(data: {
  username: string;
  email: string;
  passwordHash: string;
}) {
  return db.insert(usersTable).values(data).returning();
}

export function updateUser(
  userId: string,
  data: Partial<typeof usersTable.$inferInsert>,
) {
  return db
    .update(usersTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(usersTable.id, userId))
    .returning();
}

export function listUsers({
  role,
  isActive,
  limit,
  cursor,
}: {
  role?: "admin" | "author" | "user";
  isActive?: boolean;
  limit: number;
  cursor?: Date;
}) {
  const conditions = [];

  if (role) conditions.push(eq(usersTable.role, role));
  if (typeof isActive === "boolean")
    conditions.push(eq(usersTable.isActive, isActive));
  if (cursor) conditions.push(lt(usersTable.createdAt, cursor));

  return db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      role: usersTable.role,
      isActive: usersTable.isActive,
      emailVerifiedAt: usersTable.emailVerifiedAt,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(usersTable.createdAt))
    .limit(limit + 1);
}
