import { upsertStreamUser } from "../../shared/config/stream.config.js";
import ApiError from "../../shared/utils/apiError.util.js";
import { ErrorFormatter } from "../../shared/utils/errorFormatter.js";
import User from "../users/user.model.js";
import crypto from "crypto";

// ==========================
// Constants
// ==========================
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour
const MIN_RESEND_INTERVAL_MS = 30 * 1000; // 30 seconds
const VERIFICATION_CODE_LENGTH = 6;
const AVATAR_COUNT = 100;

// ==========================
// Helpers
// ==========================
function generateVerificationCode() {
  const code = Math.floor(
    10 ** (VERIFICATION_CODE_LENGTH - 1) +
      Math.random() * 9 * 10 ** (VERIFICATION_CODE_LENGTH - 1)
  ).toString();

  return {
    code,
    expiresAt: new Date(Date.now() + ONE_HOUR_MS),
  };
}

function generateRandomAvatar() {
  const idx = Math.floor(Math.random() * AVATAR_COUNT) + 1;
  return `https://avatar.iran.liara.run/public/${idx}.png`;
}

function generateResetToken() {
  const token = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
}

// ==========================
// User Services
// ==========================
export async function createUser({ fullName, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const detail = ErrorFormatter.createFieldError(
      "email",
      "Duplicate email",
      email
    );
    throw new ApiError(
      "Email already exists, please use a different one",
      409,
      [detail]
    );
  }

  const randomAvatar = generateRandomAvatar();
  const { code, expiresAt } = generateVerificationCode();

  const newUser = await User.create({
    email,
    fullName,
    password,
    profilePic: randomAvatar,
    verificationToken: code,
    verificationTokenExpiresAt: expiresAt,
  });

  return newUser;
}

export async function resendVerificationEmail(userId) {
  const user = await User.findById(userId).select(
    "isVerified verificationToken verificationTokenExpiresAt email"
  );

  if (!user) throw new ApiError("User not found", 404);
  if (user.isVerified) throw new ApiError("User is already verified", 400);

  // Prevent resending too soon (protects against bypassing middleware)
  if (
    user.verificationTokenExpiresAt &&
    Date.now() <
      user.verificationTokenExpiresAt - (ONE_HOUR_MS - MIN_RESEND_INTERVAL_MS)
  ) {
    throw new ApiError(
      "Please wait a few seconds before requesting another verification code.",
      429
    );
  }

  const { code, expiresAt } = generateVerificationCode();
  user.verificationToken = code;
  user.verificationTokenExpiresAt = expiresAt;

  await user.save();
  return user;
}

export async function verifyUserEmail(code) {
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) throw new ApiError("Invalid or expired verification code", 400);

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  return user;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Invalid email or password", 401);

  const isValidPassword = await user.isValidPassword(password);
  if (!isValidPassword) throw new ApiError("Invalid email or password", 401);

  return user;
}

export async function forgotUserPassword(email) {
  const user = await User.findOne({ email }).select(
    "email resetPasswordToken resetPasswordExpiresAt"
  );
  if (!user) return null; // Silent fail

  const { token, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiresAt = new Date(Date.now() + ONE_HOUR_MS);

  await user.save();
  return { userEmail: user.email, resetToken: token };
}

export async function resetUserPassword(token, password) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });

  if (!user) throw new ApiError("Invalid or expired reset token", 400);

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  return user;
}

export async function fetchProfile(userId) {
  const user = await User.findById(userId).select(
    "fullName email profilePic bio location nativeLanguage learningLanguage isOnboarded isVerified "
  );

  if (!user) throw new ApiError("User not found", 404);

  return user;
}

export async function onBoardUser(userData) {
  const { userId, nativeLanguage, learningLanguage } = userData;

  if (nativeLanguage === learningLanguage) {
    const detail = ErrorFormatter.createFieldError(
      "language",
      "Learning language cannot be the same as native language",
      learningLanguage
    );
    throw new ApiError("Validation failed", 400, [detail]);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { ...userData, isOnboarded: true },
    { new: true }
  );

  if (!updatedUser) throw new ApiError("User not found", 404);

  return updatedUser;
}

export async function addStreamUser({ id, fullName, profilePic }) {
  await upsertStreamUser({
    id: id.toString(),
    name: fullName,
    image: profilePic || "",
  });
}
