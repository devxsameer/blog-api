// src/modules/comment/comment.schema.ts
import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(2000),
    parentId: z.uuid().optional(),
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const commentIdParamSchema = z.object({
  params: z.object({
    commentId: z.uuid(),
  }),
});

export type CommentIdParam = z.infer<typeof commentIdParamSchema>;

export const listCommentsQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().min(1).max(50).default(20),
    cursor: z.iso.datetime().optional(),
  }),
});

export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;
