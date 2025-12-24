// src/modules/posts/post.permissions.ts
import { Request } from "express";
import * as PostService from "./post.service.js";

export const getPostOwner = async (req: Request) => {
  return PostService.getOwnerId(req.params.postSlug);
};
