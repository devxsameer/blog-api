// src/modules/user/user.routes.ts
import { Router } from "express";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware.js";
import { Role } from "@/constants/roles.js";
import * as UserController from "./user.controller.js";

const userRoutes = Router();

userRoutes.get(
  "/",
  requireAuth,
  requireRole(Role.ADMIN),
  UserController.adminListUsers
);

userRoutes.put("/me", requireAuth, UserController.updateMe);

userRoutes.put(
  "/:userId",
  requireAuth,
  requireRole(Role.ADMIN),
  UserController.adminUpdateUser
);
userRoutes.get(
  "/me/avatar/upload",
  requireAuth,
  UserController.getAvatarUpload
);

userRoutes.put("/me/avatar", requireAuth, UserController.updateAvatar);

export default userRoutes;
