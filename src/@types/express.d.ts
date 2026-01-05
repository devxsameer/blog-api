// src/types/express.d.ts
import { AuthUser } from "./auth.ts";
import "express";

export {};

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      validated?: {
        body?: any;
        params?: any;
        query?: any;
      };
      user?: AuthUser;
      authError?:string;
    }
  }
}
