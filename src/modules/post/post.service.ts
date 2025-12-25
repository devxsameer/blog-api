// src/modules/post/post.service.ts
import { generateSlug } from "@/utils/slug.js";
import * as PostRepo from "./post.repository.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/errors/http-errors.js";
import { canDeletePost } from "./post.policy.js";
import { AuthUser } from "@/@types/auth.js";

export async function createPost(
  authorId: string,
  input: {
    title: string;
    contentMarkdown: string;
    excerpt?: string;
    status: "draft" | "published";
  }
) {
  const slug = generateSlug(input.title);

  const existing = await PostRepo.findPostBySlug(slug);

  if (existing.length) {
    throw new ConflictError("Post with same slug already exists");
  }

  const [post] = await PostRepo.createPost({
    authorId,
    title: input.title,
    slug,
    excerpt: input.excerpt,
    contentMarkdown: input.contentMarkdown,
    status: input.status,
    publishedAt: input.status === "published" ? new Date() : null,
  });

  return post;
}

export async function getPostBySlug(slug: string) {
  const [post] = await PostRepo.findPostBySlug(slug);

  if (!post) throw new NotFoundError("Post not found");

  return post;
}

export async function updatePost(
  postId: string,
  input: Partial<{
    title: string;
    contentMarkdown: string;
    excerpt: string;
    status: "draft" | "published";
  }>
) {
  if (input.title) {
    input = {
      ...input,
      slug: generateSlug(input.title),
    } as any;
  }

  const [post] = await PostRepo.updatePostById(postId, input);

  if (!post) throw new NotFoundError("Post not found");

  return post;
}

export async function deletePost(user: AuthUser, slug: string) {
  const [post] = await PostRepo.findPostBySlug(slug);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (!canDeletePost(user, post)) {
    throw new ForbiddenError("You cannot delete this post");
  }

  const [deletedPost] = await PostRepo.deletePostBySlug(slug);

  return deletedPost;
}
