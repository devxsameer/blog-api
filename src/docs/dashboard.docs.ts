import { openApiDocument } from "./openapi.js";

openApiDocument.paths["/dashboard/admin/overview"] = {
  get: {
    summary: "Admin dashboard overview",
    description: "Aggregated platform-wide statistics for administrators",
    tags: ["Dashboard"],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: "Admin dashboard data",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean" },
                data: {
                  type: "object",
                  properties: {
                    totals: {
                      type: "object",
                      properties: {
                        posts: { type: "number" },
                        publishedPosts: { type: "number" },
                        likes: { type: "number" },
                        comments: { type: "number" },
                        users: { type: "number" },
                      },
                    },
                    activity: {
                      type: "object",
                      properties: {
                        postsLast7Days: { type: "number" },
                        likesLast7Days: { type: "number" },
                        viewsLast7Days: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
            example: {
              success: true,
              data: {
                totals: {
                  posts: 42,
                  publishedPosts: 31,
                  likes: 512,
                  comments: 128,
                  users: 19,
                },
                activity: {
                  postsLast7Days: 6,
                  likesLast7Days: 84,
                  viewsLast7Days: 340,
                },
              },
            },
          },
        },
      },
      401: { $ref: "#/components/responses/Unauthorized" },
      403: { $ref: "#/components/responses/Forbidden" },
    },
  },
};

openApiDocument.paths["/dashboard/author/overview"] = {
  get: {
    summary: "Author dashboard overview",
    description: "Aggregated statistics for the authenticated author",
    tags: ["Dashboard"],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: "Author dashboard data",
        content: {
          "application/json": {
            example: {
              success: true,
              data: {
                posts: 12,
                publishedPosts: 8,
                likes: 143,
                views: 2201,
              },
            },
          },
        },
      },
      401: { $ref: "#/components/responses/Unauthorized" },
    },
  },
};
