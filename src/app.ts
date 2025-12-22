// src/app.ts
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./modules/auth/auth.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { httpLogger, requestId } from "./middlewares/logger.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

/* -------------------- CORE MIDDLEWARE -------------------- */
app.use(requestId);
app.use(express.json());
app.use(httpLogger);

/* -------------------- ROUTES -------------------- */
app.route("/").get((req, res, next) => {
  res.json("Hello from Blog API");
});

app.use("/auth", authRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

app.use(globalErrorHandler);
