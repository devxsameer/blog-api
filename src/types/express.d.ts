import { AuthUser } from "./auth";
// src/types/express.d.ts
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
    }
  }
}
