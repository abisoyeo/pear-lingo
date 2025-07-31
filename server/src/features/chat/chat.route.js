import express from "express";
import {
  protectRoute,
  requireVerifiedAndOnboardedUser,
} from "../auth/auth.middleware.js";
import { getStreamToken } from "./chat.controller.js";

const router = express.Router();

router.get(
  "/token",
  protectRoute,
  requireVerifiedAndOnboardedUser,
  getStreamToken
);

export default router;
