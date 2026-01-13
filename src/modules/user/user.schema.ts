// src/modules/user/user.schema.ts
import { z } from "zod";

export const updateMeSchema = z.object({
  username: z.string().min(3).max(32).optional(),
  bio: z.string().max(500).optional(),
});

export const adminUpdateUserSchema = updateMeSchema.extend({
  role: z.enum(["admin", "author", "user"]).optional(),
  isActive: z.boolean().optional(),
});

export const adminListUsersQuerySchema = z.object({
  role: z.enum(["admin", "author", "user"]).optional(),
  isActive: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.iso.datetime().optional(),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z.url(),
});
