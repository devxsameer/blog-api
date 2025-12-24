// src/modules/post/post.repository.ts
import { db } from "@/db/index.js";
import { postsTable } from "@/db/schema/posts.js";
import { desc, eq } from "drizzle-orm";

export function createPost(data: typeof postsTable.$inferInsert) {
  return db.insert(postsTable).values(data).returning();
}

export function findPostBySlug(slug: string) {
  return db.select().from(postsTable).where(eq(postsTable.slug, slug)).limit(1);
}

export function findPostById(id: string) {
  return db.select().from(postsTable).where(eq(postsTable.id, id)).limit(1);
}

export function findPostOwnerBySlug(postSlug: string) {
  return db
    .select({ authorId: postsTable.authorId })
    .from(postsTable)
    .where(eq(postsTable.slug, postSlug))
    .limit(1);
}

export function updatePostById(
  postId: string,
  data: Partial<typeof postsTable.$inferInsert>
) {
  return db
    .update(postsTable)
    .set(data)
    .where(eq(postsTable.id, postId))
    .returning();
}

export function deletePostById(postId: string) {
  return db.delete(postsTable).where(eq(postsTable.id, postId));
}

export function findPublishedPosts(limit: number, offset: number) {
  return db
    .select()
    .from(postsTable)
    .where(eq(postsTable.status, "published"))
    .orderBy(desc(postsTable.publishedAt))
    .limit(limit)
    .offset(offset);
}
