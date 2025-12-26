// src/app.ts
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./env.js";

import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { httpLogger, requestId } from "./middlewares/logger.middleware.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import { securityMiddleware } from "./middlewares/security.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import postRoutes from "./modules/post/post.routes.js";
import commentRoutes from "./modules/comment/comment.routes.js";
import postLikesRoutes from "./modules/post-like/post-like.routes.js";
import tagRoutes from "./modules/tag/tag.routes.js";

import { NotFoundError } from "./errors/http-errors.js";
import { swaggerHandler, swaggerMiddleware } from "./docs/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", true);

/* ------------------------ SECURITY ----------------------- */
app.use(securityMiddleware);

/* ------------------------ CORS ----------------------- */
app.use(corsMiddleware);
app.options("{*path}", corsMiddleware);

/* -------------------- CORE MIDDLEWARE -------------------- */
app.use(requestId);
app.use(express.json());
app.use(httpLogger);

/* -------------------- ROUTES -------------------- */
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/tags", tagRoutes);
app.use("/", commentRoutes);
app.use("/", postLikesRoutes);

/* -------------------- DOCS -------------------- */
if (env.NODE_ENV !== "production") {
  app.use("/docs", swaggerMiddleware, swaggerHandler);
}

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("Route"));
});

app.use(globalErrorHandler);

export default app;
