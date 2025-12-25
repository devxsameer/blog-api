// src/modules/post/post.schema.ts
import { z } from "zod";

export const listPostsQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().min(1).max(50).default(10),
    cursor: z.iso.datetime().optional(),
  }),
});

export type ListPostsQuery = z.infer<typeof listPostsQuerySchema.shape.query>;

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(255),
    contentMarkdown: z.string().min(10),
    excerpt: z.string().trim().max(500).optional(),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    tags: z.array(z.string().trim().max(30)).max(10).optional(),
  }),
});

export type CreatePostBody = z.infer<typeof createPostSchema.shape.body>;

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(255).optional(),
    contentMarkdown: z.string().min(10).optional(),
    excerpt: z.string().trim().max(500).optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    tags: z.array(z.string().trim().max(30)).max(10).optional(),
  }),
});

export type UpdatePostBody = z.infer<typeof updatePostSchema.shape.body>;

export const postSlugParamSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .min(3)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid post slug format"),
  }),
});

export type PostSlugParams = z.infer<typeof postSlugParamSchema.shape.params>;
