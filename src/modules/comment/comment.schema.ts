// src/modules/comment/comment.schema.ts
import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  parentId: z.uuid().optional(),
});

export const commentIdParamSchema = z.object({
  commentId: z.uuid(),
});

export const listCommentsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.iso.datetime().optional(),
});
