// src/modules/comments/comments.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  CommentIdParam,
  CreateCommentInput,
  ListCommentsQuery,
} from "./comment.schema.js";
import { PostSlugParamInput } from "@/modules/post/post.schema.js";
import * as CommentService from "./comment.service.js";
import { sendResponse } from "@/utils/api-response.js";

export async function listByPost(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const { slug } = req.validated!.params as PostSlugParamInput["params"];
  const { limit, cursor } = req.validated!.query as ListCommentsQuery["query"];

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
  const { slug } = req.validated!.params as PostSlugParamInput["params"];
  const data = req.validated!.body as CreateCommentInput["body"];

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
  const { commentId } = req.validated!.params as CommentIdParam["params"];

  const comment = await CommentService.deleteComment(req.user!, commentId);

  return sendResponse(res, {
    message: `Post with id ${comment.id} has been successfully deleted.`,
  });
}
