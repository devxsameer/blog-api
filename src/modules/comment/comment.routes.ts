// src/modules/comment/comment.routes.ts
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validate.middleware.js";
import { Router } from "express";
import {
  commentIdParamSchema,
  createCommentSchema,
  listCommentsQuerySchema,
} from "./comment.schema.js";
import * as CommentsController from "./comment.controller.js";
import { requireAuth } from "@/middlewares/auth.middleware.js";
import { writeRateLimit } from "@/middlewares/rate-limit.middleware.js";
import { postSlugParamSchema } from "../post/post.schema.js";

const commentRoutes = Router();

commentRoutes
  .route("/posts/:slug/comments")
  .get(
    validateParams(postSlugParamSchema),
    validateQuery(listCommentsQuerySchema),
    CommentsController.listByPost
  )
  .post(
    requireAuth,
    writeRateLimit,
    validateBody(createCommentSchema),
    CommentsController.createComment
  );

commentRoutes.delete(
  "/comments/:commentId",
  requireAuth,
  validateParams(commentIdParamSchema),
  CommentsController.deleteComment
);
export default commentRoutes;
