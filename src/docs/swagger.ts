import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi.js";

// import docs so they register themselves
import "./posts.docs.js";
// import "./auth.docs.js"; // later
// import "./comments.docs.js";

export const swaggerMiddleware = swaggerUi.serve;
export const swaggerHandler = swaggerUi.setup(openApiDocument, {
  explorer: true,
  customSiteTitle: "Blog API Docs",
});
