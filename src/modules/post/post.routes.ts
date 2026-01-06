// src/modules/post/post.routes.ts
import {
  blockReadOnly,
  optionalAuth,
  requireAuth,
  requireRole,
} from "@/middlewares/auth.middleware.js";
import { Router } from "express";
import * as PostController from "./post.controller.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validate.middleware.js";
import {
  createPostSchema,
  dashboardPostsQuerySchema,
  listPostsQuerySchema,
  postSlugParamSchema,
  updatePostSchema,
} from "./post.schema.js";
import { Role } from "@/constants/roles.js";
import { publicReadRateLimit } from "@/middlewares/rate-limit.middleware.js";

const postRoutes = Router();

postRoutes.get(
  "/dashboard",
  requireAuth,
  requireRole(Role.ADMIN, Role.AUTHOR),
  validateQuery(dashboardPostsQuerySchema),
  PostController.listDashboard
);

postRoutes
  .route("/")
  .get(
    publicReadRateLimit,
    optionalAuth,
    validateQuery(listPostsQuerySchema),
    PostController.listPublic
  )
  .post(
    requireAuth,
    requireRole(Role.ADMIN, Role.AUTHOR),
    blockReadOnly,
    validateBody(createPostSchema),
    PostController.createPost
  );

postRoutes
  .route("/:slug")
  .get(
    publicReadRateLimit,
    optionalAuth,
    validateParams(postSlugParamSchema),
    PostController.getPost
  )
  .put(
    requireAuth,
    blockReadOnly,
    validateParams(postSlugParamSchema),
    validateBody(updatePostSchema),
    PostController.updatePost
  )
  .delete(
    requireAuth,
    blockReadOnly,
    validateParams(postSlugParamSchema),
    PostController.deletePost
  );

export default postRoutes;
