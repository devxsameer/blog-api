// src/modules/comment/comment.routes.ts
import { validate } from "@/middlewares/validate.middleware.js";
import { Router } from "express";
import {
  commentIdParamSchema,
  createCommentSchema,
  listCommentsQuerySchema,
} from "./comment.schema.js";
import * as CommentsController from "./comment.controller.js";
import { requireAuth } from "@/middlewares/auth.middleware.js";

const commentRoutes = Router();

commentRoutes
  .route("/posts/:slug/comments")
  .get(validate(listCommentsQuerySchema), CommentsController.listByPost)
  .post(
    requireAuth,
    validate(createCommentSchema),
    CommentsController.createComment
  );

commentRoutes.delete(
  "/comments/:commentId",
  requireAuth,
  validate(commentIdParamSchema),
  CommentsController.deleteComment
);
export default commentRoutes;
