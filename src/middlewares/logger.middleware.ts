// src/middlewares/logger.middleware.ts
import { logger } from "@/utils/logger.js";
import { pinoHttp } from "pino-http";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.id,
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = randomUUID();

  req.id = id;
  res.setHeader("X-Request-Id", id);

  next();
}
