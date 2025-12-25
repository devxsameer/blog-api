// src/modules/post/post.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  CreatePostBody,
  ListPostsQuery,
  PostSlugParams,
  UpdatePostBody,
} from "./post.schema.js";
import * as PostService from "./post.service.js";
import { sendResponse } from "@/utils/api-response.js";

export async function list(req: Request, res: Response) {
  const { limit, cursor } = req.validated!.query as ListPostsQuery;

  const result = await PostService.listPublishedPosts({
    limit,
    cursor,
    userId: req.user?.id,
  });

  return sendResponse(res, {
    data: result.items,
    meta: result.pageInfo,
  });
}

export async function getPost(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const { slug } = req.validated!.params as PostSlugParams;
  const user = req.user ?? null;

  const post = await PostService.getPostBySlug(user, slug, req.ip!);

  return sendResponse(res, {
    data: post,
  });
}
export async function createPost(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const body = req.validated!.body as CreatePostBody;

  const post = await PostService.createPost(req.user!.id, body);

  return sendResponse(res, {
    statusCode: 201,
    message: "Post created successfully.",
    data: post,
  });
}
export async function updatePost(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const body = req.validated?.body as UpdatePostBody;
  const { slug } = req.validated?.params as PostSlugParams;

  const post = await PostService.updatePost(req.user!, slug, body);

  return sendResponse(res, {
    message: `Post with id ${post.id} has been successfully updated.`,
    data: post,
  });
}

export async function deletePost(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const { slug } = req.validated?.params as PostSlugParams;

  const post = await PostService.deletePost(req.user!, slug);

  return sendResponse(res, {
    message: `Post with id ${post.id} has been successfully deleted.`,
  });
}
