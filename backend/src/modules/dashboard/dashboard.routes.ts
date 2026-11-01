import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { UserRole } from "../../types/user.types";
import { DashboardControllers } from "./dashboard.controller";

const router = Router();

router.get("/stats", auth(UserRole.ADMIN), DashboardControllers.getStats);

export const DashboardRoutes = router;
