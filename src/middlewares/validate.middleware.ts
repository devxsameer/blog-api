// src/middlewares/validate.middleware.ts
import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    schema.parse({ body: req.body, params: req.params, query: req.query });
    next();
  };
