// src/modules/post/post.service.ts
import { generateSlug } from "@/utils/slug.js";
import * as PostRepo from "./post.repository.js";
import { ForbiddenError, NotFoundError } from "@/errors/http-errors.js";
import { canDeletePost, canUpdatePost, canViewPost } from "./post.policy.js";
import { AuthUser } from "@/@types/auth.js";
import * as TagService from "@/modules/tag/tag.service.js";
import * as TagRepo from "@/modules/tag/tag.repository.js";
import {
  CreatePostBody,
  DashboardPostsQuery,
  UpdatePostBody,
} from "./post.schema.js";
import { Role } from "@/constants/roles.js";

export async function listPublishedPosts({
  limit,
  cursor,
  userId,
}: {
  limit: number;
  cursor?: string;
  userId?: string;
}) {
  const posts = await PostRepo.findPublishedPostsCursor({
    limit,
    cursor: cursor ? new Date(cursor) : undefined,
    userId,
  });

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
export async function listDashboardPosts(
  user: AuthUser,
  query: DashboardPostsQuery
) {
  const filters: any = {
    status: query.status,
  };

  // AUTHOR → force ownership
  if (user.role === Role.AUTHOR) {
    filters.authorId = user.id;
  }

  // ADMIN → optional author filter
  if (user.role === Role.ADMIN && query.authorId) {
    filters.authorId = query.authorId;
  }

  const posts = await PostRepo.findDashboardPosts({
    ...filters,
    limit: query.limit,
    cursor: query.cursor ? new Date(query.cursor) : undefined,
    sort: query.sort,
    order: query.order,
  });

  const hasNextPage = posts.length > query.limit;

  return {
    items: hasNextPage ? posts.slice(0, query.limit) : posts,
    pageInfo: {
      hasNextPage,
      nextCursor: hasNextPage
        ? posts[query.limit - 1][query.sort]?.toISOString()
        : null,
    },
  };
}

export async function createPost(authorId: string, input: CreatePostBody) {
  const slug = generateSlug(input.title);

  const tagIds = input.tags ? await TagService.processTags(input.tags) : [];

  const [post] = await PostRepo.createPost({
    authorId,
    title: input.title,
    slug,
    excerpt: input.excerpt,
    contentMarkdown: input.contentMarkdown,
    status: input.status,
    publishedAt: input.status === "published" ? new Date() : null,
  });

  await TagRepo.attachTagsToPost(post.id, tagIds);

  return post;
}

export async function getPostBySlug(
  user: AuthUser | null,
  slug: string,
  ip: string
) {
  const [post] = await PostRepo.findPostBySlugWithLikeStatus(slug, user?.id);

  if (!post) throw new NotFoundError("Post");

  if (!canViewPost(user, post)) {
    throw new ForbiddenError("You cannot view this post");
  }

  if (ip && (!user || user.id !== post.authorId)) {
    PostRepo.recordPostView(post.id, ip).catch(() => {});
  }

  const tags = await TagService.getTagsForPost(post.id);

  return {
    ...post,
    tags,
  };
}

export async function updatePost(
  user: AuthUser,
  slug: string,
  input: UpdatePostBody
) {
  // Slug is immutable once created
  const [post] = await PostRepo.findPostBySlug(slug);

  if (!post) {
    throw new NotFoundError("Post");
  }

  if (!canUpdatePost(user, post)) {
    throw new ForbiddenError("You cannot update this post");
  }

  const [updatedPost] = await PostRepo.updatePostBySlug(slug, input);

  if (input.tags) {
    const tagIds = await TagService.processTags(input.tags);
    await TagRepo.replacePostTags(post.id, tagIds);
  }

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
