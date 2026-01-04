// src/middlewares/error.middleware.ts
import { ApiError } from "@/errors/api-error.js";
import { logger } from "@/utils/logger.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        issues: err.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
    });
  }

  // Known App Errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Unknown / Programmer Errors
  logger.error(
    {
      err,
      requestId: req.requestId,
      path: req.path,
      method: req.method,
    },
    "Unhandled error"
  );

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
}
