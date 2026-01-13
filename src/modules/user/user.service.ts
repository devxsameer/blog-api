// src/modules/user/user.service.ts
import * as UserRepo from "./user.repository.js";
import { ForbiddenError, NotFoundError } from "@/errors/http-errors.js";
import { canUpdateUser } from "./user.policy.js";
import { AuthUser } from "@/@types/auth.js";
import { cloudinary } from "@/config/cloudinary.js";
import crypto from "node:crypto";

export async function updateMe(user: AuthUser, input: any) {
  const [updated] = await UserRepo.updateUser(user.id, input);
  return updated;
}

export async function adminUpdateUser(
  admin: AuthUser,
  targetUserId: string,
  input: any
) {
  if (!canUpdateUser(admin, targetUserId)) {
    throw new ForbiddenError();
  }

  const [user] = await UserRepo.updateUser(targetUserId, input);
  if (!user) throw new NotFoundError("User");

  return user;
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  const [user] = await UserRepo.updateUser(userId, { avatarUrl });
  return user;
}

export function getAvatarUploadSignature(userId: string) {
  const timestamp = Math.floor(Date.now() / 1000);

  const publicId = `avatars/${userId}-${crypto.randomUUID()}`;

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      public_id: publicId,
      folder: "avatars",
    },
    cloudinary.config().api_secret!
  );

  return {
    cloudName: cloudinary.config().cloud_name,
    apiKey: cloudinary.config().api_key,
    timestamp,
    signature,
    publicId,
    uploadPreset: undefined,
  };
}

export async function adminListUsers(query: any) {
  const users = await UserRepo.listUsers({
    role: query.role,
    isActive: query.isActive,
    limit: query.limit,
    cursor: query.cursor ? new Date(query.cursor) : undefined,
  });

  const hasNextPage = users.length > query.limit;
  const items = hasNextPage ? users.slice(0, query.limit) : users;

  return {
    items,
    pageInfo: {
      hasNextPage,
      nextCursor: hasNextPage
        ? items[items.length - 1].createdAt?.toISOString() ?? null
        : null,
    },
  };
}
