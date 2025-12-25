// src/modules/post-like/post-like.routes.ts
import { Router } from "express";
import { requireAuth } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { postSlugParamSchema } from "@/modules/post/post.schema.js";
import { createLike, deleteLike } from "./post-like.controller.js";

const postLikesRoutes = Router();

postLikesRoutes
  .route("/posts/:slug/like")
  .post(requireAuth, validate(postSlugParamSchema), createLike)
  .delete(requireAuth, validate(postSlugParamSchema), deleteLike);

export default postLikesRoutes;
