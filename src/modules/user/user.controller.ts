// src/modules/user/user.controller.ts
import { Request, Response } from "express";
import * as UserService from "./user.service.js";
import { sendResponse } from "@/utils/api-response.js";
import {
  updateMeSchema,
  adminUpdateUserSchema,
  updateAvatarSchema,
  adminListUsersQuerySchema,
  userIdParamSchema,
} from "./user.schema.js";

export async function updateMe(req: Request, res: Response) {
  const data = updateMeSchema.parse(req.body);
  const user = await UserService.updateMe(req.user!, data);

  return sendResponse(res, {
    message: "Profile updated",
    data: user,
  });
}

export async function adminUpdateUser(req: Request, res: Response) {
  const data = adminUpdateUserSchema.parse(req.body);
  const { userId } = userIdParamSchema.parse(req.params);

  const user = await UserService.adminUpdateUser(req.user!, userId, data);

  return sendResponse(res, {
    message: "User updated",
    data: user,
  });
}

export async function updateAvatar(req: Request, res: Response) {
  const { avatarUrl } = updateAvatarSchema.parse(req.body);

  const user = await UserService.updateAvatar(req.user!.id, avatarUrl);

  return sendResponse(res, {
    message: "Profile picture updated",
    data: user,
  });
}

export async function getAvatarUpload(req: Request, res: Response) {
  const signatureData = UserService.getAvatarUploadSignature(req.user!.id);

  return sendResponse(res, {
    message: "Upload signature generated",
    data: signatureData,
  });
}

export async function adminListUsers(req: Request, res: Response) {
  const query = adminListUsersQuerySchema.parse(req.query);

  const result = await UserService.adminListUsers(query);

  return sendResponse(res, {
    message: "Users fetched successfully",
    data: result.items,
    meta: result.pageInfo,
  });
}
