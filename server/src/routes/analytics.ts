import { Router } from "express";
import { getDashboardAnalytics, getUrlAnalytics } from "../controllers/analyticsController";
import { validateObjectId } from "../middleware/validation";
import { auth } from "../middleware/auth";

const router = Router();

// GET /api/analytics/dashboard - Get dashboard analytics (protected)
router.get("/dashboard", auth, getDashboardAnalytics);

// GET /api/analytics/url/:id - Get URL-specific analytics (protected)
router.get("/url/:id", auth, validateObjectId, getUrlAnalytics);

export default router;
