import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./features/auth/auth.route.js";
import { connectDB } from "./shared/config/db.config.js";
import errorHandler from "./shared/middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to connect to MongoDB and start server:",
      err.message
    );
  });
