import express from "express";
import { protectRoute } from "../auth/auth.middleware.js";
import { getStreamToken } from "./chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

export default router;
