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
  resendEmail,
} from "./auth.controller.js";
import validate from "../../shared/middlewares/validate.middleware.js";
import { authValidation } from "./auth.validator.js";
import { protectRoute } from "./auth.middleware.js";
import createRateLimiter from "../../shared/middlewares/rateLimit.middleware.js";
import rateLimitConfig from "../../shared/config/rateLimit.config.js";

const router = express.Router();

// Public auth routes
router.post(
  "/signup",
  createRateLimiter(rateLimitConfig.signup),
  validate(authValidation.signup),
  signup
);
router.post(
  "/login",
  createRateLimiter(rateLimitConfig.login),
  validate(authValidation.login),
  login
);
router.post(
  "/verify-email",
  createRateLimiter(rateLimitConfig.verifyEmail),
  validate(authValidation.verifyEmail),
  verifyEmail
);
router.post(
  "/forgot-password",
  createRateLimiter(rateLimitConfig.forgotPassword),
  validate(authValidation.forgotPassword),
  forgotPassword
);
router.post(
  "/reset-password/:token",
  createRateLimiter(rateLimitConfig.resetPassword),
  validate(authValidation.resetPassword),
  resetPassword
);

// Protected routes
router.use(protectRoute);

router.post(
  "/verification-email/resend",
  createRateLimiter(rateLimitConfig.resendVerification),
  resendEmail
);
router.post("/onboarding", validate(authValidation.onboarding), onboard);
router.get("/me", profile);
router.post("/logout", logout);

export default router;
