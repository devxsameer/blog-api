// src/modules/post/post.routes.ts
import {
  optionalAuth,
  requireAuth,
  requireRole,
} from "@/middlewares/auth.middleware.js";
import { Router } from "express";
import * as PostController from "./post.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  createPostSchema,
  listPostsQuerySchema,
  postSlugParamSchema,
  updatePostSchema,
} from "./post.schema.js";
import { Role } from "@/constants/roles.js";

const postRoutes = Router();

postRoutes
  .route("/")
  .get(validate(listPostsQuerySchema), PostController.list)
  .post(
    requireAuth,
    requireRole(Role.ADMIN, Role.AUTHOR),
    validate(createPostSchema),
    PostController.createPost
  );

postRoutes
  .route("/:slug")
  .get(optionalAuth, validate(postSlugParamSchema), PostController.getPost)
  .put(
    requireAuth,
    validate(postSlugParamSchema),
    validate(updatePostSchema),
    PostController.updatePost
  )
  .delete(
    requireAuth,
    validate(postSlugParamSchema),
    PostController.deletePost
  );

export default postRoutes;
