// src/modules/post/post.policy.ts
import { AuthUser } from "@/@types/auth.js";
import { Role } from "@/constants/roles.js";

type PostResource = {
  authorId: string;
};

export function canDeletePost(user: AuthUser, post: PostResource) {
  if (user.role === Role.ADMIN) return true;

  if (user.role === Role.AUTHOR && user.id === post.authorId) return true;

  return false;
}
