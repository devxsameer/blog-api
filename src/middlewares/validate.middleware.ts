// src/middlewares/validate.middleware.ts
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateParams =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.params);
    next();
  };

export const validateBody =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };

export const validateQuery =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.query);
    next();
  };
