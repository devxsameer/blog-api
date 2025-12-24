// src/modules/post/post.service.ts
import { generateSlug } from "@/utils/slug.js";
import * as PostRepo from "./post.repository.js";
import { ConflictError, NotFoundError } from "@/errors/http-errors.js";

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

export async function getOwnerId(postSlug: string) {
  const [post] = await PostRepo.findPostOwnerBySlug(postSlug);

  if (!post) throw new NotFoundError("Post");

  return post.authorId;
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

export async function deletePost(postId: string) {
  await PostRepo.deletePostById(postId);
}
