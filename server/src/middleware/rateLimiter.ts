import rateLimit from "express-rate-limit";

// Rate limiter for URL shortening - 100 requests per hour
export const urlShortenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour
  message: {
    error: "Too many URL shortening requests, please try again later",
    retryAfter: "Please wait an hour before making more requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    const authReq = req as any;
    return authReq.user?.userId || req.ip;
  },
});

// Rate limiter for authentication - 5 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: "Too many authentication attempts, please try again later",
    retryAfter: "Please wait 15 minutes before trying again",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// General API rate limiter - 1000 requests per hour
export const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // 1000 requests per hour
  message: {
    error: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
