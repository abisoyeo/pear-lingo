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
    handler: (req, res, next) => {
      logger.warn("Rate limit hit", {
        ip: req.ip,
        path: req.originalUrl,
        method: req.method,
        userAgent: req.get("User-Agent"),
      });
      next(new ApiError(message, 429));
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
