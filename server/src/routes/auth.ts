import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController";
import { validateRegister, validateLogin } from "../middleware/validation";
import { auth } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

// POST /api/auth/register - Register new user
router.post("/register", authLimiter, validateRegister, register);

// POST /api/auth/login - Login user
router.post("/login", authLimiter, validateLogin, login);

// GET /api/auth/profile - Get user profile (protected)
router.get("/profile", auth, getProfile);

export default router;
