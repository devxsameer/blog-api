// src/modules/comments/comments.service.ts
import * as PostRepo from "@/modules/post/post.repository.js";
import * as CommentRepo from "./comments.repository.js";
import { AuthUser } from "@/@types/auth.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "@/errors/http-errors.js";
import { canDeleteComment } from "./comment.policy.js";

export async function listCommentsByPost({
  postSlug,
  limit,
  cursor,
}: {
  postSlug: string;
  limit: number;
  cursor?: string;
}) {
  const [post] = await PostRepo.findPostBySlug(postSlug);
  if (!post) throw new NotFoundError("Post");

  const comments = await CommentRepo.findByPost(
    post.id,
    limit,
    cursor ? new Date(cursor) : undefined
  );

  const hasNextPage = comments.length > limit;
  const items = hasNextPage ? comments.slice(0, limit) : comments;

  const nextCursor = hasNextPage
    ? items[items.length - 1].createdAt.toISOString()
    : null;

  return {
    items,
    pageInfo: {
      nextCursor,
      hasNextPage,
    },
  };
}

export async function createComment(
  userId: string,
  postSlug: string,
  input: { content: string; parentId?: string }
) {
  const [post] = await PostRepo.findPostBySlug(postSlug);
  if (!post) throw new NotFoundError("Post not found");

  if (input.parentId) {
    const [parent] = await CommentRepo.findById(input.parentId);
    if (!parent || parent.postId !== post.id) {
      throw new BadRequestError("Invalid parent comment");
    }
  }

  const [comment] = await CommentRepo.createComment({
    authorId: userId,
    postId: post.id,
    content: input.content,
    parentId: input.parentId,
  });

  return comment;
}

export async function deleteComment(user: AuthUser, commentId: string) {
  const [comment] = await CommentRepo.findById(commentId);

  if (!comment) {
    throw new NotFoundError("Comment");
  }

  if (!canDeleteComment(user, comment)) {
    throw new ForbiddenError("You cannot delete this comment");
  }

  const [deletedComment] = await CommentRepo.deleteById(commentId);

  return deletedComment;
}
