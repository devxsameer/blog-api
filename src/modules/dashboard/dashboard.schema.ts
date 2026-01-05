// src/modules/dashboard/dashboard.schema.ts
import { z } from "zod";

export const adminOverviewSchema = z.object({
  totals: z.object({
    posts: z.number(),
    publishedPosts: z.number(),
    likes: z.number(),
    comments: z.number(),
    users: z.number(),
  }),
  activity: z.object({
    postsLast7Days: z.number(),
    likesLast7Days: z.number(),
    viewsLast7Days: z.number(),
  }),
});

export const authorOverviewSchema = z.object({
  posts: z.number(),
  publishedPosts: z.number(),
  likes: z.number(),
  views: z.number(),
});
