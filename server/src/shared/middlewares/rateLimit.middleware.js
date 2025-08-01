import rateLimit from "express-rate-limit";
import ApiError from "../utils/apiError.util.js";
import logger from "../utils/logger.js";

/**
 * Create a rate limiter middleware.
 * @param {Object} options
 * @param {number} options.max - Max number of requests per window.
 * @param {number} options.windowMs - Time window in milliseconds.
 * @param {string} options.message - Error message when limit is exceeded.
 */
export default function createRateLimiter({ max, windowMs, message }) {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => {
      // Use email from body if available, fallback to IP
      return req.body?.email || req.ip;
    },
    handler: (req, res, next) => {
      logger.warn("Rate limit hit", {
        ip: req.ip,
        path: req.originalUrl,
        method: req.method,
        userAgent: req.get("User-Agent"),
      });
      const retryAfterSeconds = Math.ceil(windowMs / 1000);

      next(new ApiError(message, 429, { retryAfter: retryAfterSeconds }));
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
