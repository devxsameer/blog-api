// src/modules/comment/comment.controller.ts
import { Request, Response } from "express";
import {
  commentIdParamSchema,
  createCommentSchema,
  listCommentsQuerySchema,
} from "./comment.schema.js";
import { postSlugParamSchema } from "@/modules/post/post.schema.js";
import * as CommentService from "./comment.service.js";
import { sendResponse } from "@/utils/api-response.js";

export async function listByPost(req: Request, res: Response) {
  const { slug } = postSlugParamSchema.parse(req.params);
  const { limit, cursor } = listCommentsQuerySchema.parse(req.query);

  const result = await CommentService.listCommentsByPost({
    postSlug: slug,
    limit,
    cursor,
  });

  return sendResponse(res, {
    data: result.items,
    meta: result.pageInfo,
  });
}

export async function createComment(req: Request, res: Response) {
  const { slug } = postSlugParamSchema.parse(req.params);
  const data = createCommentSchema.parse(req.body);

  const comment = await CommentService.createComment(req.user!.id, slug, data);

  return sendResponse(res, {
    statusCode: 201,
    message: "Comment created successfully.",
    data: comment,
  });
}

export async function deleteComment(req: Request, res: Response) {
  const { commentId } = commentIdParamSchema.parse(req.params);

  const comment = await CommentService.deleteComment(req.user!, commentId);

  return sendResponse(res, {
    message: `Comment with id ${comment.id} has been successfully deleted.`,
  });
}
