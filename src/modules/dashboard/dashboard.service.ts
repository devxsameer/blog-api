// src/modules/dashboard/dashboard.service.ts
import { db } from "@/db/index.js";
import { count, eq, sql } from "drizzle-orm";
import {
  adminOverviewSchema,
  authorOverviewSchema,
} from "./dashboard.schema.js";
import { postsTable } from "@/db/schema/posts.js";
import { postLikesTable } from "@/db/schema/post-likes.js";
import { commentsTable } from "@/db/schema/comments.js";
import { usersTable } from "@/db/schema/users.js";
import { postViewsTable } from "@/db/schema/post-views.js";

export async function getAdminOverview() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [data] = await db
    .select({
      posts: sql<number>`(SELECT count(*) FROM ${postsTable})`.mapWith(Number),
      publishedPosts:
        sql<number>`(SELECT count(*) FROM ${postsTable} WHERE status = 'published')`.mapWith(
          Number
        ),
      likes: sql<number>`(SELECT count(*) FROM ${postLikesTable})`.mapWith(
        Number
      ),
      comments: sql<number>`(SELECT count(*) FROM ${commentsTable})`.mapWith(
        Number
      ),
      users:
        sql<number>`(SELECT count(*) FROM ${usersTable} WHERE deleted_at IS NULL)`.mapWith(
          Number
        ),
      postsLast7Days:
        sql<number>`(SELECT count(*) FROM ${postsTable} WHERE created_at >= ${sevenDaysAgo})`.mapWith(
          Number
        ),
      likesLast7Days:
        sql<number>`(SELECT count(*) FROM ${postLikesTable} WHERE created_at >= ${sevenDaysAgo})`.mapWith(
          Number
        ),
      viewsLast7Days:
        sql<number>`(SELECT count(*) FROM ${postViewsTable} WHERE viewed_at >= ${sevenDaysAgo})`.mapWith(
          Number
        ),
    })
    .from(postsTable)
    .limit(1);

  const result = {
    totals: {
      posts: data?.posts ?? 0,
      publishedPosts: data?.publishedPosts ?? 0,
      likes: data?.likes ?? 0,
      comments: data?.comments ?? 0,
      users: data?.users ?? 0,
    },
    activity: {
      postsLast7Days: data?.postsLast7Days ?? 0,
      likesLast7Days: data?.likesLast7Days ?? 0,
      viewsLast7Days: data?.viewsLast7Days ?? 0,
    },
  };

  return adminOverviewSchema.parse(result);
}

export async function getAuthorOverview(authorId: string) {
  const [stats] = await db
    .select({
      posts: count(),
      publishedPosts:
        sql<number>`count(*) filter (where ${postsTable.status} = 'published')`.mapWith(
          Number
        ),
      likes: sql<number>`coalesce(sum(${postsTable.likeCount}), 0)`.mapWith(
        Number
      ),
      views: sql<number>`coalesce(sum(${postsTable.viewCount}), 0)`.mapWith(
        Number
      ),
    })
    .from(postsTable)
    .where(eq(postsTable.authorId, authorId));

  const result = stats || { posts: 0, publishedPosts: 0, likes: 0, views: 0 };

  return authorOverviewSchema.parse(result);
}
