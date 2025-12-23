import { UnauthorizedError } from "@/errors/http-errors.js";
import { verifyAccessToken } from "@/utils/jwt.js";
import { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header) throw new UnauthorizedError();

  const token = header.split(" ")[1];
  if (!token) throw new UnauthorizedError();

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    throw new UnauthorizedError();
  }
}
