import * as Sentry from "@sentry/node";
import ApiError from "../utils/apiError.util.js";
import logger from "../utils/logger.js";

const isProduction = process.env.NODE_ENV === "production";

const errorHandler = (error, req, res, next) => {
  let status = error.statusCode || 500;

  // ─── Error Normalization ─────────────────────────────

  if (error.name === "CastError") {
    error = new ApiError("Invalid ID format", 400);
  }

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((val) => val.message);
    error = new ApiError("Validation error", 400, message);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } '${value}' already exists`;
    error = new ApiError("Duplicate resource", 409, message);
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError("Internal server error", 500, {
      originalMessage: error.message,
      name: error.name,
    });
  }

  status = error.statusCode;

  // ─── Skip 4xx Logs in Production ─────────────────────

  if (!isProduction || status >= 500) {
    const baseLog = {
      message: error.message,
      status,
      details: error.details,
      path: req.originalUrl,
      method: req.method,
    };

    if (isProduction) {
      logger.error("Error occurred", {
        ...baseLog,
        stack: error.stack,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
        user: req.user ? { id: req.user.id, email: req.user.email } : undefined,
      });
    } else {
      logger.error("Error occurred", baseLog);
    }
  }

  // ─── Sentry for Production Errors ─────────────────────

  if (isProduction && status >= 500) {
    Sentry.captureException(error, {
      contexts: {
        http: {
          method: req.method,
          url: req.originalUrl,
          status_code: status,
        },
      },
      user: req.user ? { id: req.user.id, email: req.user.email } : undefined,
    });
  }

  // ─── Client Response ──────────────────────────────────
  
  res.status(status).json({
    success: false,
    message: error.message,
    error: error.details ?? null,
  });
};

export default errorHandler;
