// src/modules/post/post.routes.ts
import { requireAuth, requireRole } from "@/middlewares/auth.middleware.js";
import { Router } from "express";
import * as PostController from "./post.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { createPostSchema, postSlugParamSchema } from "./post.schema.js";
import { Role } from "@/constants/roles.js";

const postRoutes = Router();

postRoutes
  .route("/")
  .post(
    requireAuth,
    requireRole(Role.ADMIN, Role.AUTHOR),
    validate(createPostSchema),
    PostController.create
  );

postRoutes
  .route("/:postSlug")
  .delete(
    requireAuth,
    validate(postSlugParamSchema),
    PostController.deletePost
  );

export default postRoutes;
