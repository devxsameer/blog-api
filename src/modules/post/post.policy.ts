// src/modules/post/post.policy.ts
import { AuthUser } from "@/@types/auth.js";
import { Role } from "@/constants/roles.js";
import { postsTable } from "@/db/schema/posts.js";

type PostResource = typeof postsTable.$inferSelect;

export function canViewPost(user: AuthUser | null, post: PostResource) {
  if (post.status === "published") return true;

  if (!user) return false;

  if (user.role === Role.ADMIN) return true;

  if (user.id === post.authorId) return true;

  return false;
}

export function canUpdatePost(user: AuthUser, post: PostResource) {
  if (user.role === Role.ADMIN) return true;

  if (user.role === Role.AUTHOR && user.id === post.authorId) return true;

  return false;
}

export function canDeletePost(user: AuthUser, post: PostResource) {
  if (user.role === Role.ADMIN) return true;

  if (user.role === Role.AUTHOR && user.id === post.authorId) return true;

  return false;
}
