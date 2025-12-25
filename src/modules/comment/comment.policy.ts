// src/modules/comment/comment.policy.ts
import { AuthUser } from "@/@types/auth.js";
import { Role } from "@/constants/roles.js";

export function canDeleteComment(
  user: AuthUser,
  comment: { authorId: string }
) {
  if (user.role === Role.ADMIN) return true;
  return user.id === comment.authorId;
}
