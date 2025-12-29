// src/modules/post-like/post-like.routes.ts
import { Router } from "express";
import { requireAuth } from "@/middlewares/auth.middleware.js";
import { validateParams } from "@/middlewares/validate.middleware.js";
import { postSlugParamSchema } from "@/modules/post/post.schema.js";
import { createLike, deleteLike } from "./post-like.controller.js";
import { writeRateLimit } from "@/middlewares/rate-limit.middleware.js";

const postLikesRoutes = Router();

postLikesRoutes
  .route("/posts/:slug/like")
  .post(
    requireAuth,
    writeRateLimit,
    validateParams(postSlugParamSchema),
    createLike
  )
  .delete(
    requireAuth,
    writeRateLimit,
    validateParams(postSlugParamSchema),
    deleteLike
  );

export default postLikesRoutes;
