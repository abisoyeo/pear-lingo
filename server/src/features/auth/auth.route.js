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
  changePassword,
  googleAuth,
} from "./auth.controller.js";
import passport from "./passport.config.js";
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

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  googleAuth
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
  "/verify-email",
  createRateLimiter(rateLimitConfig.verifyEmail),
  validate(authValidation.verifyEmail),
  verifyEmail
);
router.post(
  "/verification-email/resend",
  createRateLimiter(rateLimitConfig.resendVerification),
  resendEmail
);
router.put(
  "/change-password",
  validate(authValidation.changePassword),
  changePassword
);
router.post("/onboarding", validate(authValidation.onboarding), onboard);
router.get("/me", profile);
router.post("/logout", logout);

export default router;
