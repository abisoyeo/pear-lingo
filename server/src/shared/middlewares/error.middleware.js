import ApiError from "../utils/apiError.util.js";

const errorHandler = (error, req, res, next) => {
  console.error("Error:", {
    message: error.message,
    status: error.statusCode || 500,
    details: error.details,
    stack: error.stack,
    path: req.originalUrl,
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

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    error: error.details ?? null,
  });
};

export default errorHandler;
