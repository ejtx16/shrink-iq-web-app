import { Router } from "express";
import { redirectUrl } from "../controllers/urlController";
import { validateShortCode } from "../middleware/validation";

const router = Router();

// GET /:shortCode - Redirect to original URL
router.get("/:shortCode", validateShortCode, redirectUrl);

export default router;
