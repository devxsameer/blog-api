// src/middlewares/auth.middleware.ts
import { verifyAccessToken } from "@/utils/jwt.js";
import { ForbiddenError, UnauthorizedError } from "@/errors/http-errors.js";
import type { RequestHandler } from "express";
import { Request } from "express";
import { Role } from "@/@types/auth.js";

/* ---------------- AUTH ---------------- */

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header) throw new UnauthorizedError();

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) throw new UnauthorizedError();

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
};

/* ---------------- ROLE ---------------- */

export const requireRole =
  (...allowedRoles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) throw new UnauthorizedError();

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError();
    }

    next();
  };

/* ---------------- OWNERSHIP ---------------- */

export const requireOwnership =
  (
    getResourceOwnerId: (req: Request) => Promise<string | null>
  ): RequestHandler =>
  async (req, _res, next) => {
    if (!req.user) throw new UnauthorizedError();

    const ownerId = await getResourceOwnerId(req);

    if (req.user.role === "admin") return next();

    if (req.user.id !== ownerId) {
      throw new ForbiddenError();
    }

    next();
  };
