// src/modules/user/user.policy.ts
import { AuthUser } from "@/@types/auth.js";
import { Role } from "@/constants/roles.js";

export function canUpdateUser(requester: AuthUser, targetUserId: string) {
  if (requester.role === Role.ADMIN) return true;
  return requester.id === targetUserId;
}
