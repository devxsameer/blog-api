// src/app.ts
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { httpLogger, requestId } from "./middlewares/logger.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import postRoutes from "./modules/post/post.routes.js";

import { NotFoundError } from "./errors/http-errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

/* -------------------- CORE MIDDLEWARE -------------------- */
app.use(requestId);
app.use(express.json());
app.use(httpLogger);

/* -------------------- ROUTES -------------------- */
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("Route"));
});

app.use(globalErrorHandler);
