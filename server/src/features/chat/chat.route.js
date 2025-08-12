import express from "express";
import {
  protectRoute,
  requireVerifiedAndOnboardedUser,
} from "../auth/auth.middleware.js";
import { getStreamToken, handleStreamWebhook } from "./chat.controller.js";

const router = express.Router();

router.post("/webhook", express.json(), handleStreamWebhook);

router.get(
  "/token",
  protectRoute,
  requireVerifiedAndOnboardedUser,
  getStreamToken
);

export default router;
