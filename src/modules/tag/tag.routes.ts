// src/modules/tag/tag.routes.ts
import { Router } from "express";
import * as TagService from "./tag.service.js";
import { sendResponse } from "@/utils/api-response.js";

const tagRoutes = Router();

tagRoutes.get("/", async (_req, res) => {
  const tags = await TagService.getPopularTags();

  return sendResponse(res, {
    data: tags,
  });
});

export default tagRoutes;
