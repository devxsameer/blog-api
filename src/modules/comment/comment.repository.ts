// src/modules/comment/comment.repository.ts
import { db } from "@/db/index.js";
import { commentsTable } from "@/db/schema/comments.js";
import { usersTable } from "@/db/schema/users.js";
import { and, desc, eq, getTableColumns, lt } from "drizzle-orm";

export function findByPost(postId: string, limit: number, cursor?: Date) {
  const whereClause = cursor
    ? and(eq(commentsTable.postId, postId), lt(commentsTable.createdAt, cursor))
    : eq(commentsTable.postId, postId);

  return db
    .select({
      ...getTableColumns(commentsTable),
      author: {
        id: usersTable.id,
        username: usersTable.username,
        avatarUrl: usersTable.avatarUrl,
      },
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.authorId, usersTable.id))
    .where(whereClause)
    .orderBy(desc(commentsTable.createdAt))
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
