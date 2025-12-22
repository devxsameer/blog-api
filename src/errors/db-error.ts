// src/errors/db-error.ts
import { DatabaseError } from "pg";
import { AppError } from "./app-error.js";

export function handleDbError(err: unknown): never {
  // PostgreSQL errors
  if (err instanceof DatabaseError) {
    switch (err.code) {
      case "23505": // unique_violation
        throw new AppError("Resource already exists", 409, "UNIQUE_CONSTRAINT");

      case "23503": // foreign_key_violation
        throw new AppError(
          "Invalid reference to related resource",
          400,
          "FOREIGN_KEY_CONSTRAINT"
        );

      case "23502": // not_null_violation
        throw new AppError(
          "Missing required field",
          400,
          "NOT_NULL_CONSTRAINT"
        );

      case "22P02": // invalid_text_representation (uuid, int, etc)
        throw new AppError("Invalid input format", 400, "INVALID_INPUT");

      default:
        throw new AppError("Database error", 500, "DATABASE_ERROR");
    }
  }

  // Unknown
  throw err;
}
