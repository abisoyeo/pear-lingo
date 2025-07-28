import { upsertStreamUser } from "../../shared/config/stream.config.js";
import ApiError from "../../shared/utils/apiError.util.js";
import { ErrorFormatter } from "../../shared/utils/errorFormatter.js";
import User from "../users/user.model.js";
import crypto from "crypto";

export async function createUser(userData) {
  const { fullName, email, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const detail = ErrorFormatter.createFieldError(
      "email",
      "Duplicate email",
      email
    );

    throw new ApiError("Email already exists, please use a diffrent one", 409, [
      detail,
    ]);
  }

  const idx = Math.floor(Math.random() * 100) + 1;
  const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const newUser = await User.create({
    email,
    fullName,
    password,
    profilePic: randomAvatar,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000, // 1 hour
  });

  return newUser;
}

export async function verifyUserEmail(code) {
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError("Invalid or expired verification code", 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  return user;
}

export async function loginUser(userData) {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isValidPassword = await user.isValidPassword(password);

  if (!isValidPassword) {
    throw new ApiError("Invalid email or password", 401);
  }

  return user;
}

export async function forgotUserPassword(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError("User not found", 400);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiresAt = resetTokenExpiresAt;

  await user.save();

  return { userEmail: user.email, resetToken: resetToken };
}

export async function resetUserPassword(token, password) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError("Invalid or expired reset token", 400);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  return user;
}

export async function onBoardUser(userData) {
  const { userId, nativeLanguage, learningLanguage } = userData;

  if (nativeLanguage === learningLanguage) {
    const detail = ErrorFormatter.createFieldError(
      "learningLanguage",
      "Learning language cannot be the same as native language",
      learningLanguage
    );
    throw new ApiError("Validation failed", 400, [detail]);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...userData,
      isOnboarded: true,
    },
    { new: true }
  );

  if (!updatedUser) throw new ApiError("User not found", 404);

  return updatedUser;
}

export async function addStreamUser(userData) {
  await upsertStreamUser({
    id: userData.id.toString(),
    name: userData.fullName,
    image: userData.profilePic || "",
  });
}
