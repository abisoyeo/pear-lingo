import sendResponse from "../../shared/utils/sendResponse.util.js";
import {
  addStreamUser,
  createUser,
  fetchProfile,
  forgotUserPassword,
  loginUser,
  onBoardUser,
  resendVerificationEmail,
  resetUserPassword,
  verifyUserEmail,
} from "./auth.service.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../../shared/mailtrap/emails.js";

export async function signup(req, res, next) {
  try {
    const { email, password, fullName } = req.body;

    const userData = {
      email,
      password,
      fullName,
    };

    const newUser = await createUser(userData);

    await sendVerificationEmail(newUser.email, newUser.verificationToken);

    await addStreamUser(newUser);

    const token = newUser.generateAuthToken();

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    sendResponse(res, 201, "User registered successfully", {
      id: newUser.id,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const userData = {
      ...req.body,
    };

    const user = await loginUser(userData);

    const token = user.generateAuthToken();

    user.lastLogin = new Date();
    await user.save();

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    sendResponse(res, 200, "User signed in successfully", {
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  res.clearCookie("jwt");
  sendResponse(res, 200, "Logout Successful");
}

export const verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.body;

    const verifiedUser = await verifyUserEmail(code);
    await sendWelcomeEmail(verifiedUser.email, verifiedUser.fullName);

    sendResponse(res, 200, "Email verified successfully", {
      id: verifiedUser.id,
      email: verifiedUser.email,
    });
  } catch (error) {
    next(error);
  }
};

export const resendEmail = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await resendVerificationEmail(userId);

    await sendVerificationEmail(user.email, user.verificationToken);

    sendResponse(res, 200, "Verification email resent successfully");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await forgotUserPassword(email);

    if (result) {
      await sendPasswordResetEmail(
        result.userEmail,
        `${process.env.CLIENT_URL}/reset-password/${result.resetToken}`
      );
    }

    sendResponse(res, 200, "Password reset link sent to your email");
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await resetUserPassword(token, password);

    await sendResetSuccessEmail(user.email);

    sendResponse(res, 200, "Password reset successful");
  } catch (error) {
    next(error);
  }
};

export async function onboard(req, res, next) {
  try {
    const userData = { userId: req.user.id, ...req.body };

    const updatedUser = await onBoardUser(userData);

    await addStreamUser(updatedUser);

    sendResponse(res, 200, "Onboard successful", updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function profile(req, res, next) {
  try {
    const userId = req.user.id;

    const user = await fetchProfile(userId);

    sendResponse(res, 200, "Profile fetch successful", user);
  } catch (error) {
    next(error);
  }
}
