// src/modules/post-like/post-like.controller.ts
import { NextFunction, Request, Response } from "express";
import { PostSlugParams } from "../post/post.schema.js";
import { sendResponse } from "@/utils/api-response.js";
import { likePost, unlikePost } from "./post-like.service.js";

export async function createLike(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const { slug } = req.validated!.params as PostSlugParams;

  await likePost(req.user!.id, slug);

  return sendResponse(res, {
    statusCode: 201,
    message: "Post liked",
  });
}
export async function deleteLike(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const { slug } = req.validated!.params as PostSlugParams;

  await unlikePost(req.user!.id, slug);

  return sendResponse(res, {
    statusCode: 204,
  });
}
