import express from "express";
import {
  login,
  logout,
  onboard,
  profile,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";
import validate from "../../shared/middlewares/validate.middleware.js";
import { authValidation } from "./auth.validator.js";
import { protectRoute } from "./auth.middleware.js";
import loginRateLimiter from "../../shared/middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", validate(authValidation.signup), signup);
router.post("/verify-email", validate(authValidation.verifyEmail), verifyEmail);
router.post("/login", loginRateLimiter, validate(authValidation.login), login);

router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  forgotPassword
);
router.post(
  "/reset-password/:token",
  validate(authValidation.resetPassword),
  resetPassword
);

router.post("/logout", logout);

router.post(
  "/onboarding",
  protectRoute,
  validate(authValidation.onboarding),
  onboard
);

router.get("/me", protectRoute, profile);

export default router;
