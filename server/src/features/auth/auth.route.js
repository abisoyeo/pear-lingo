import express from "express";
import { login, logout, onboard, profile, signup } from "./auth.controller.js";
import validate from "../../shared/middlewares/validate.middleware.js";
import { authValidation } from "./auth.validator.js";
import { protectRoute } from "./auth.middleware.js";
import loginRateLimiter from "../../shared/middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", validate(authValidation.signup), signup);
router.post("/login", loginRateLimiter, validate(authValidation.login), login);
router.post("/logout", logout);

router.post(
  "/onboarding",
  protectRoute,
  validate(authValidation.onboarding),
  onboard
);

router.get("/me", protectRoute, profile);

export default router;
