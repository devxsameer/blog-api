// src/modules/user/user.service.ts
import * as UserRepo from "./user.repository.js";
import { ForbiddenError, NotFoundError } from "@/errors/http-errors.js";
import { canUpdateUser } from "./user.policy.js";
import { AuthUser } from "@/@types/auth.js";
import { cloudinary } from "@/config/cloudinary.js";
import { buildAvatarUrl } from "./user.utils.js";

export async function updateMe(
  user: AuthUser,
  input: { username?: string; bio?: string },
) {
  const [updated] = await UserRepo.updateUser(user.id, input);
  return updated;
}

export async function adminUpdateUser(
  admin: AuthUser,
  targetUserId: string,
  input: {
    username?: string;
    bio?: string;
  },
) {
  if (!canUpdateUser(admin, targetUserId)) {
    throw new ForbiddenError();
  }

  const [user] = await UserRepo.updateUser(targetUserId, input);
  if (!user) throw new NotFoundError("User");

  return user;
}

export async function updateAvatar(userId: string, publicId: string) {
  const expectedPublicId = `blog/avatars/avatar_${userId}`;
  if (publicId !== expectedPublicId) {
    throw new ForbiddenError("Invalid avatar reference");
  }

  let resource;
  try {
    resource = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });
  } catch {
    throw new NotFoundError("Uploaded avatar not found");
  }

  const avatarUrl = buildAvatarUrl(resource, 256);
  const [user] = await UserRepo.updateUser(userId, { avatarUrl });
  return user;
}

export function getAvatarUploadSignature(userId: string) {
  const { cloud_name, api_key, api_secret } = cloudinary.config();

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `avatar_${userId}`;

  const paramsToSign = {
    timestamp,
    folder: "blog/avatars",
    public_id: publicId,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    api_secret!,
  );

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    fields: {
      api_key,
      signature,
      ...paramsToSign,
    },
    publicId,
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
        ? (items[items.length - 1].createdAt?.toISOString() ?? null)
        : null,
    },
  };
}
