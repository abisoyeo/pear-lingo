import "dotenv/config";
import express from "express";
import * as Sentry from "@sentry/node";
import { initSentry } from "./shared/config/sentry.config.js";
import httpLogger from "./shared/middlewares/httpLogger.middleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./features/auth/auth.route.js";
import userRoutes from "./features/users/user.route.js";
import chatRoutes from "./features/chat/chat.route.js";
import { connectDB } from "./shared/config/db.config.js";
import errorHandler from "./shared/middlewares/error.middleware.js";
import logger from "./shared/utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// initSentry(app);

// Sentry request handler must be first
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());

app.use(httpLogger);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

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
