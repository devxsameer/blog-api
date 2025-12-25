// src/modules/comments/comments.repository.ts
import { db } from "@/db/index.js";
import { commentsTable } from "@/db/schema/comments.js";
import { and, asc, eq, gt } from "drizzle-orm";

export function findByPost(postId: string, limit: number, cursor?: Date) {
  const whereClause = cursor
    ? and(eq(commentsTable.postId, postId), gt(commentsTable.createdAt, cursor))
    : eq(commentsTable.postId, postId);

  return db
    .select()
    .from(commentsTable)
    .where(whereClause)
    .orderBy(asc(commentsTable.createdAt))
    .limit(limit + 1);
}

export function findById(commentId: string) {
  return db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.id, commentId))
    .limit(1);
}
export function createComment(data: typeof commentsTable.$inferInsert) {
  return db.insert(commentsTable).values(data).returning();
}
export function deleteById(commentId: string) {
  return db
    .delete(commentsTable)
    .where(eq(commentsTable.id, commentId))
    .returning();
}
