import { OpenAPIV3 } from "openapi-types";

export const commonSchemas: Record<string, OpenAPIV3.SchemaObject> = {
  ErrorResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      error: {
        type: "object",
        properties: {
          code: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },

  CursorPageInfo: {
    type: "object",
    properties: {
      nextCursor: { type: "string", nullable: true },
      hasNextPage: { type: "boolean" },
    },
  },

  User: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      username: { type: "string" },
      email: { type: "string" },
      role: { type: "string", enum: ["user", "author", "admin"] },
    },
  },
};
