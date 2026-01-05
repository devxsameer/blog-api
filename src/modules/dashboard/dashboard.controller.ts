// src/modules/dashboard/dashboard.controller.ts
import { Request, Response } from "express";
import * as DashboardService from "./dashboard.service.js";
import { sendResponse } from "@/utils/api-response.js";

export async function adminOverview(_req: Request, res: Response) {
  const data = await DashboardService.getAdminOverview();

  return sendResponse(res, {
    message: "Admin dashboard overview",
    data,
  });
}

export async function authorOverview(req: Request, res: Response) {
  const userId = req.user!.id;

  const data = await DashboardService.getAuthorOverview(userId);

  return sendResponse(res, {
    message: "Author dashboard overview",
    data,
  });
}
