// src/modules/post/post.service.ts
import { generateSlug } from "@/utils/slug.js";
import * as PostRepo from "./post.repository.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/errors/http-errors.js";
import { canDeletePost, canUpdatePost, canViewPost } from "./post.policy.js";
import { AuthUser } from "@/@types/auth.js";

export async function listPublishedPosts({
  limit,
  cursor,
}: {
  limit: number;
  cursor?: string;
}) {
  const posts = await PostRepo.findPublishedPostsCursor(
    limit,
    cursor ? new Date(cursor) : undefined
  );

  const hasNextPage = posts.length > limit;
  const items = hasNextPage ? posts.slice(0, limit) : posts;

  const nextCursor = hasNextPage
    ? items[items.length - 1].publishedAt?.toISOString() ?? null
    : null;

  return {
    items,
    pageInfo: {
      nextCursor,
      hasNextPage,
    },
  };
}

export async function createPost(
  authorId: string,
  input: {
    title: string;
    contentMarkdown: string;
    excerpt?: string;
    status: "draft" | "published" | "archived";
  }
) {
  const slug = generateSlug(input.title);

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

export async function getPostBySlug(
  user: AuthUser | null,
  slug: string,
  ip: string
) {
  const [post] = await PostRepo.findPostBySlug(slug);

  if (!post) throw new NotFoundError("Post");

  if (!canViewPost(user, post)) {
    throw new ForbiddenError("You cannot view this post");
  }

  if (ip && (!user || user.id !== post.authorId)) {
    PostRepo.recordPostView(post.id, ip).catch(() => {});
  }

  return post;
}

export async function updatePost(
  user: AuthUser,
  slug: string,
  input: Partial<{
    title: string;
    contentMarkdown: string;
    excerpt: string;
    status: "draft" | "published" | "archived";
  }>
) {
  const [post] = await PostRepo.findPostBySlug(slug);

  if (!post) {
    throw new NotFoundError("Post");
  }

  if (!canUpdatePost(user, post)) {
    throw new ForbiddenError("You cannot update this post");
  }

  const [updatedPost] = await PostRepo.updatePostBySlug(slug, input);

  return updatedPost;
}

export async function deletePost(user: AuthUser, slug: string) {
  const [post] = await PostRepo.findPostBySlug(slug);

  if (!post) {
    throw new NotFoundError("Post");
  }

  if (!canDeletePost(user, post)) {
    throw new ForbiddenError("You cannot delete this post");
  }

  const [deletedPost] = await PostRepo.deletePostBySlug(slug);

  return deletedPost;
}
