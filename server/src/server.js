import express from "express";
import "dotenv/config";

import authRoutes from "./features/auth/auth.route.js";
import { connectDB } from "./shared/config/db.config.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello w");
});

app.use("/api/auth", authRoutes);

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
