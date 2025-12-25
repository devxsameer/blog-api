// src/modules/post-like/post-like.repository.ts
import { db } from "@/db/index.js";
import { postLikesTable } from "@/db/schema/post-likes.js";
import { postsTable } from "@/db/schema/posts.js";
import { and, eq, sql } from "drizzle-orm";

export async function like(userId: string, postId: string) {
  try {
    await db.transaction(async (tx) => {
      await tx.insert(postLikesTable).values({ userId, postId });

      await tx
        .update(postsTable)
        .set({ likeCount: sql`${postsTable.likeCount} + 1` })
        .where(eq(postsTable.id, postId));
    });
    return { liked: true };
  } catch {
    return { liked: false };
  }
}

export async function unlike(userId: string, postId: string) {
  const result = await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(postLikesTable)
      .where(
        and(
          eq(postLikesTable.userId, userId),
          eq(postLikesTable.postId, postId)
        )
      )
      .returning();

    if (!deleted.length) return false;

    await tx
      .update(postsTable)
      .set({ likeCount: sql`${postsTable.likeCount} - 1` })
      .where(eq(postsTable.id, postId));

    return true;
  });

  return { unliked: result };
}
