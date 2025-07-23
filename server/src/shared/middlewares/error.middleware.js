import * as Sentry from "@sentry/node";
import ApiError from "../utils/apiError.util.js";
import logger from "../utils/logger.js";

const errorHandler = (error, req, res, next) => {
  // Log via Winston
  logger.error("Error occurred", {
    message: error.message,
    status: error.statusCode || 500,
    details: error.details,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    user:
      process.env.NODE_ENV === "production" && req.user
        ? { id: req.user.id, email: req.user.email }
        : undefined,
  });

  // Mongoose Errors
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

  // Auto-wrap non-ApiError instances
  if (!(error instanceof ApiError)) {
    error = new ApiError("Internal server error", 500, {
      originalMessage: error.message,
      name: error.name,
    });
  }

  // Send to Sentry for 500 errors or unexpected errors
  // if (error.statusCode >= 500 || !(error instanceof ApiError)) {
  //   Sentry.captureException(error, {
  //     contexts: {
  //       http: {
  //         method: req.method,
  //         url: req.originalUrl,
  //         status_code: error.statusCode,
  //       },
  //     },
  //     user: req.user ? { id: req.user.id, email: req.user.email } : undefined,
  //   });
  // }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    error: error.details ?? null,
  });
};

export default errorHandler;
