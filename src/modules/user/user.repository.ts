// src/modules/user/user.respository.ts
import { db } from "@/db/index.js";
import { usersTable } from "@/db/schema/users.js";
import { and, eq, isNull } from "drizzle-orm";

export function findUserById(id: string) {
  return db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.id, id),
        eq(usersTable.isActive, true),
        isNull(usersTable.deletedAt)
      )
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
