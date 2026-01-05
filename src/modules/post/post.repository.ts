// src/modules/post/post.repository.ts
import { db } from "@/db/index.js";
import { postLikesTable } from "@/db/schema/post-likes.js";
import { postViewsTable } from "@/db/schema/post-views.js";
import { postsTable } from "@/db/schema/posts.js";
import { usersTable } from "@/db/schema/users.js";
import { and, asc, desc, eq, getTableColumns, lt, sql } from "drizzle-orm";

export function createPost(data: typeof postsTable.$inferInsert) {
  return db.insert(postsTable).values(data).returning();
}

export function findPostBySlug(slug: string) {
  return db.select().from(postsTable).where(eq(postsTable.slug, slug)).limit(1);
}

export function findPostBySlugWithLikeStatus(slug: string, userId?: string) {
  return db
    .select({
      ...getTableColumns(postsTable),
      author: {
        username: usersTable.username,
        bio: usersTable.bio,
        avatarUrl: usersTable.avatarUrl,
      },
      likedByMe: userId
        ? sql<boolean>`exists (
            select 1
            from post_likes pl
            where pl.post_id = ${postsTable.id}
              and pl.user_id = ${userId}
          )`
        : sql<boolean>`false`,
    })
    .from(postsTable)
    .innerJoin(usersTable, eq(postsTable.authorId, usersTable.id))
    .where(eq(postsTable.slug, slug))
    .limit(1);
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
    .where(eq(postsTable.slug, slug))
    .returning();
}

export function deletePostBySlug(slug: string) {
  return db.delete(postsTable).where(eq(postsTable.slug, slug)).returning();
}

export function findPublishedPostsCursor({
  limit,
  cursor,
  userId,
}: {
  limit: number;
  cursor?: Date;
  userId?: string;
}) {
  const whereClause = cursor
    ? and(
        eq(postsTable.status, "published"),
        lt(postsTable.publishedAt, cursor)
      )
    : eq(postsTable.status, "published");

  return db
    .select({
      id: postsTable.id,
      authorId: postsTable.authorId,
      title: postsTable.title,
      slug: postsTable.slug,
      excerpt: postsTable.excerpt,
      viewCount: postsTable.viewCount,
      likeCount: postsTable.likeCount,
      publishedAt: postsTable.publishedAt,
      likedByMe: userId
        ? sql<boolean>`exists (
            select 1 
            from ${postLikesTable} pl 
            where pl.post_id = ${postsTable.id} 
              and pl.user_id = ${userId}
          )`
        : sql<boolean>`false`,
    })
    .from(postsTable)
    .where(whereClause)
    .orderBy(desc(postsTable.publishedAt))
    .limit(limit + 1);
}

export function findDashboardPosts({
  authorId,
  status,
  limit,
  cursor,
  sort,
  order,
}: {
  authorId?: string;
  status?: "published" | "archived" | "draft";
  limit: number;
  cursor?: Date;
  sort: "createdAt" | "updatedAt" | "publishedAt";
  order: "asc" | "desc";
}) {
  const conditions = [];

  if (authorId) conditions.push(eq(postsTable.authorId, authorId));
  if (status) conditions.push(eq(postsTable.status, status));
  if (cursor) conditions.push(lt(postsTable[sort], cursor));

  return db
    .select({
      id: postsTable.id,
      authorId: postsTable.authorId,
      title: postsTable.title,
      status: postsTable.status,
      slug: postsTable.slug,
      viewCount: postsTable.viewCount,
      likeCount: postsTable.likeCount,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      publishedAt: postsTable.publishedAt,
    })
    .from(postsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(order === "asc" ? asc(postsTable[sort]) : desc(postsTable[sort]))
    .limit(limit + 1);
}

export async function recordPostView(postId: string, ipAddress: string) {
  try {
    const today = new Date().toISOString().slice(0, 10);

    await db.transaction(async (tx) => {
      await tx.insert(postViewsTable).values({
        postId,
        ipAddress,
        viewDate: today,
      });

      await tx
        .update(postsTable)
        .set({ viewCount: sql`${postsTable.viewCount} + 1` })
        .where(eq(postsTable.id, postId));
    });
  } catch {
    // ignore duplicate views
  }
}
