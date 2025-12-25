// src/modules/post/post.repository.ts
import { db } from "@/db/index.js";
import { postsTable } from "@/db/schema/posts.js";
import { and, desc, eq, lt } from "drizzle-orm";

export function createPost(data: typeof postsTable.$inferInsert) {
  return db.insert(postsTable).values(data).returning();
}

export function findPostBySlug(slug: string) {
  return db.select().from(postsTable).where(eq(postsTable.slug, slug)).limit(1);
}

export function findPostById(id: string) {
  return db.select().from(postsTable).where(eq(postsTable.id, id)).limit(1);
}

export function updatePostBySlug(
  slug: string,
  data: Partial<typeof postsTable.$inferInsert>
) {
  return db
    .update(postsTable)
    .set(data)
    .where(eq(postsTable.id, slug))
    .returning();
}

export function deletePostBySlug(slug: string) {
  return db.delete(postsTable).where(eq(postsTable.slug, slug)).returning();
}

export function findPublishedPostsCursor(limit: number, cursor?: Date) {
  const whereClause = cursor
    ? and(
        eq(postsTable.status, "published"),
        lt(postsTable.publishedAt, cursor)
      )
    : eq(postsTable.status, "published");

  return db
    .select()
    .from(postsTable)
    .where(whereClause)
    .orderBy(desc(postsTable.publishedAt))
    .limit(limit + 1);
}
