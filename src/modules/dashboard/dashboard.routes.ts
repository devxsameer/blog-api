// src/modules/dashboard/dashboard.routes.ts
import { Role } from "@/constants/roles.js";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware.js";
import * as DashboardController from "./dashboard.controller.js";
import { Router } from "express";

const dashboardRoutes = Router();

dashboardRoutes.get(
  "/admin/overview",
  requireAuth,
  requireRole(Role.ADMIN),
  DashboardController.adminOverview
);

dashboardRoutes.get(
  "/author/overview",
  requireAuth,
  requireRole(Role.AUTHOR),
  DashboardController.authorOverview
);

export default dashboardRoutes;
