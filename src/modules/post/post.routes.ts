// src/modules/post/post.routes.ts
import { requireAuth, requireRole } from "@/middlewares/auth.middleware.js";
import { Router } from "express";
import * as PostController from "./post.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { createPostSchema } from "./post.schema.js";
const postRoutes = Router();

postRoutes
  .route("/")
  .post(
    requireAuth,
    requireRole("admin", "author"),
    validate(createPostSchema),
    PostController.create
  );

  postRoutes.route("/:postSlug")

export default postRoutes;
