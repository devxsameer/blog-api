// src/modules/post-like/post-like.service.ts
import { NotFoundError } from "@/errors/http-errors.js";
import { findPostBySlug } from "../post/post.repository.js";
import * as PostLikeRepo from "./post-like.repository.js";

export async function likePost(userId: string, postSlug: string) {
  const [post] = await findPostBySlug(postSlug);

  if (!post) throw new NotFoundError("Post");

  return PostLikeRepo.like(userId, post.id);
}

export async function unlikePost(userId: string, postSlug: string) {
  const [post] = await findPostBySlug(postSlug);

  if (!post) throw new NotFoundError("Post");

  return PostLikeRepo.unlike(userId, post.id);
}
