import "dotenv/config";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from "express";
import * as Sentry from "@sentry/node";
import { initSentry } from "./shared/config/sentry.config.js";
import httpLogger from "./shared/middlewares/httpLogger.middleware.js";
import passport from "./features/auth/passport.config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import adminRoutes from "./features/admin/admin.route.js";
import authRoutes from "./features/auth/auth.route.js";
import userRoutes from "./features/users/user.route.js";
import chatRoutes from "./features/chat/chat.route.js";
import { connectDB } from "./shared/config/db.config.js";
import errorHandler from "./shared/middlewares/error.middleware.js";
import logger from "./shared/utils/logger.js";
import ApiError from "./shared/utils/apiError.util.js";
import sendResponse from "./shared/utils/sendResponse.util.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// initSentry(app);

// Sentry request handler must be first
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());

app.use(httpLogger);

app.use("/api/admins", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.get("/api/health", (req, res) => {
  sendResponse(res, 200, "Server is healthy", {
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/*", (req, res, next) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl}`));
});

// app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(
        `🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`
      );
    });
  })
  .catch((err) => {
    logger.error("❌ Failed to connect to MongoDB and start server", {
      error: err.message,
    });
  });
