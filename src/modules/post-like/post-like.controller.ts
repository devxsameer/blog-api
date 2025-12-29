// src/modules/post-like/post-like.controller.ts
import { NextFunction, Request, Response } from "express";
import { postSlugParamSchema } from "../post/post.schema.js";
import { sendResponse } from "@/utils/api-response.js";
import { likePost, unlikePost } from "./post-like.service.js";

export async function createLike(req: Request, res: Response) {
  const { slug } = postSlugParamSchema.parse(req.params);

  await likePost(req.user!.id, slug);

  return sendResponse(res, {
    statusCode: 201,
    message: "Post liked successfully.",
  });
}
export async function deleteLike(req: Request, res: Response) {
  const { slug } = postSlugParamSchema.parse(req.params);

  await unlikePost(req.user!.id, slug);

  return sendResponse(res, {
    message: "Post unliked successfully.",
  });
}
