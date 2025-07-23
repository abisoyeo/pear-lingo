import rateLimit from "express-rate-limit";
import ApiError from "../utils/apiError.util.js";
import logger from "../utils/logger.js";

const loginRateLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 4,
  handler: (req, res, next) => {
    logger.warn("Rate limit hit", {
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userAgent: req.get("User-Agent"),
    });

    const error = new ApiError(
      "Too many login attempts. Please try again later.",
      429
    );

    next(error);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginRateLimiter;
