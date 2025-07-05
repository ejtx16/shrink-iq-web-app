import { Router } from "express";
import { shortenUrl, redirectUrl, getUserUrls, deleteUrl, getUrlDetails } from "../controllers/urlController";
import { validateShortenUrl, validateShortCode, validateObjectId } from "../middleware/validation";
import { auth, optionalAuth } from "../middleware/auth";
import { urlShortenLimiter } from "../middleware/rateLimiter";

const router = Router();

// POST /api/urls/shorten - Create shortened URL (rate limited, optionally authenticated)
router.post("/shorten", urlShortenLimiter, optionalAuth, validateShortenUrl, shortenUrl);

// GET /api/urls/my - Get user's URLs (protected)
router.get("/my", auth, getUserUrls);

// GET /api/urls/:id - Get URL details with analytics (protected)
router.get("/:id", auth, validateObjectId, getUrlDetails);

// DELETE /api/urls/:id - Delete URL (protected)
router.delete("/:id", auth, validateObjectId, deleteUrl);

export default router;
