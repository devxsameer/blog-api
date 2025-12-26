// src/middlewares/security.middleware.ts
import helmet from "helmet";
import { env } from "@/env.js";

export const securityMiddleware = helmet({
  contentSecurityPolicy:
    env.NODE_ENV === "production"
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
          },
        }
      : false, // disable CSP in dev (avoids pain)

  crossOriginEmbedderPolicy: false, // needed for APIs
});
