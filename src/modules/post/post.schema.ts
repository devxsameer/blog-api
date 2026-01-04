// src/modules/post/post.schema.ts
import { z } from "zod";

export const listPostsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
  cursor: z.iso.datetime().optional(),
});

export const dashboardPostsQuerySchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  authorId: z.uuid().optional(), // ADMIN only
  sort: z.enum(["createdAt", "updatedAt", "publishedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.iso.datetime().optional(),
});

export type DashboardPostsQuery = z.infer<typeof dashboardPostsQuerySchema>;

export const createPostSchema = z.object({
  title: z.string().trim().min(3).max(255),
  contentMarkdown: z.string().min(10),
  excerpt: z.string().trim().max(500).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: z.array(z.string().trim().max(30)).max(10).optional(),
});

export type CreatePostBody = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  title: z.string().trim().min(3).max(255).optional(),
  contentMarkdown: z.string().min(10).optional(),
  excerpt: z.string().trim().max(500).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string().trim().max(30)).max(10).optional(),
});

export type UpdatePostBody = z.infer<typeof updatePostSchema>;

export const postSlugParamSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid post slug format"),
});
