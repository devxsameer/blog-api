// src/errors/db-error.ts
import { ApiError } from "./api-error.js";

type PgErrorLike = {
  code?: string;
  detail?: string;
  constraint?: string;
};

export function handleDbError(err: unknown): never {
  if (typeof err !== "object" || err === null || !("code" in err)) {
    throw err;
  }

  const pgErr = err as PgErrorLike;

  switch (pgErr.code) {
    case "23505":
      throw new ApiError("Resource already exists", 409, "UNIQUE_CONSTRAINT");

    case "23503":
      throw new ApiError(
        "Invalid reference to related resource",
        400,
        "FOREIGN_KEY_CONSTRAINT"
      );

    case "23502":
      throw new ApiError("Missing required field", 400, "NOT_NULL_CONSTRAINT");

    case "22P02":
      throw new ApiError("Invalid input format", 400, "INVALID_INPUT");
  }

  throw err;
}
