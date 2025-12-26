import { openApiDocument } from "./openapi.js";

openApiDocument.paths["/posts"] = {
  get: {
    summary: "List published posts",
    tags: ["Posts"],
    parameters: [
      {
        name: "limit",
        in: "query",
        schema: { type: "number", default: 10 },
      },
      {
        name: "cursor",
        in: "query",
        schema: { type: "string", format: "date-time" },
      },
    ],
    responses: {
      200: {
        description: "Paginated posts",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean" },
                data: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" },
                },
                meta: {
                  $ref: "#/components/schemas/CursorPageInfo",
                },
              },
            },
          },
        },
      },
    },
  },

  post: {
    summary: "Create a post",
    tags: ["Posts"],
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["title", "contentMarkdown"],
            properties: {
              title: { type: "string" },
              contentMarkdown: { type: "string" },
              excerpt: { type: "string" },
              status: {
                type: "string",
                enum: ["draft", "published", "archived"],
              },
            },
          },
        },
      },
    },
    responses: {
      201: { description: "Post created" },
      401: { $ref: "#/components/responses/Unauthorized" },
    },
  },
};
