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
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

import { NotFoundError } from "./errors/http-errors.js";
import { swaggerHandler, swaggerMiddleware } from "./docs/swagger.js";
import cookieParser from "cookie-parser";
import userRoutes from "./modules/user/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", 1);

/* ------------------------ SECURITY ----------------------- */
app.disable("x-powered-by");
app.use(securityMiddleware);

/* ------------------------ CORS ----------------------- */
app.use(corsMiddleware);
app.options("{*path}", corsMiddleware);

/* -------------------- CORE MIDDLEWARE -------------------- */
app.use(requestId);
app.use(express.json());
app.use(cookieParser());
app.use(httpLogger);

app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/* -------------------- HEALTH CHECK -------------------- */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", commentRoutes);
app.use("/api", postLikesRoutes);

/* -------------------- DOCS -------------------- */
if (env.NODE_ENV !== "production") {
  app.use("/docs", swaggerMiddleware, swaggerHandler);
}

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("Route"));
});

app.use(globalErrorHandler);

export default app;
