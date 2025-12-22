// src/types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      id: string;
      validated?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}
export {};
