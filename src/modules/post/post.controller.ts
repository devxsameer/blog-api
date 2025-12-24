// src/modules/post/post.controller.ts
import { NextFunction, Request, Response } from "express";
import { CreatePostInput } from "./post.schema.js";
import * as PostService from "./post.service.js";
import { sendResponse } from "@/utils/api-response.js";

export async function create(req: Request, res: Response, _next: NextFunction) {
  const body = req.validated!.body as CreatePostInput["body"];

  const post = await PostService.createPost(req.user!.id, body);

  return sendResponse(res, {
    statusCode: 201,
    message: "Post created successfully.",
    data: { post },
  });
}

export async function deletePost(
  req: Request,
  res: Response,
  _next: NextFunction
) {}
