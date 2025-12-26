// src/modules/comment/comment.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  CommentIdParams,
  CreateCommentBody,
  ListCommentsQuery,
} from "./comment.schema.js";
import { PostSlugParams } from "@/modules/post/post.schema.js";
import * as CommentService from "./comment.service.js";
import { sendResponse } from "@/utils/api-response.js";

export async function listByPost(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const { slug } = req.validated!.params as PostSlugParams;
  const { limit, cursor } = req.validated!.query as ListCommentsQuery;

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

export async function createComment(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const { slug } = req.validated!.params as PostSlugParams;
  const data = req.validated!.body as CreateCommentBody;

  const comment = await CommentService.createComment(req.user!.id, slug, data);

  return sendResponse(res, {
    statusCode: 201,
    message: "Comment created successfully.",
    data: comment,
  });
}

export async function deleteComment(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const { commentId } = req.validated!.params as CommentIdParams;

  const comment = await CommentService.deleteComment(req.user!, commentId);

  return sendResponse(res, {
    message: `Comment with id ${comment.id} has been successfully deleted.`,
  });
}
