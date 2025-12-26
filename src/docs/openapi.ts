// src/docs/openapi.ts
import { OpenAPIV3 } from "openapi-types";
import { commonSchemas } from "./schemas.js";

export const openApiDocument: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "Blog API",
    description:
      "A modern, production-grade REST API for a Markdown blogging platform.",
    version: "1.0.0",
    contact: {
      name: "Sameer Ali",
      url: "https://github.com/devxsameer",
    },
  },

  servers: [
    {
      url: "http://localhost:6969",
      description: "Local development",
    },
    {
      url: "https://blogapi.devxsameer.me",
      description: "Production",
    },
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  security: [{ BearerAuth: [] }],

  paths: {},
};

openApiDocument.components!.schemas = {
  ...commonSchemas,

  Post: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      title: { type: "string" },
      slug: { type: "string" },
      excerpt: { type: "string", nullable: true },
      viewCount: { type: "number" },
      likeCount: { type: "number" },
      likedByMe: { type: "boolean" },
      publishedAt: { type: "string", format: "date-time", nullable: true },
    },
  },
};
