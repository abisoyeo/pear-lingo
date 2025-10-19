import ApiError from "../utils/apiError.util.js";
import {
  PASSWORD_CHANGE_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  FRIEND_REQUEST_TEMPLATE,
  UNREAD_MESSAGE_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
  } catch (error) {
    throw new ApiError("Error sending verification email", 500, error.message);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "774f390e-ff33-4822-b19e-801d9ac68bc3",
      template_variables: {
        // company_info_name: "Pear Lingo",
        name: name,
        company_info_address: "Ikeja",
        company_info_city: "Lagos",
        company_info_zip_code: "100100",
        company_info_country: "Nigeria",
      },
    });
  } catch (error) {
    throw new ApiError("Error sending welcome email", 500, error.message);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    throw new ApiError(
      "Error sending password reset email",
      500,
      error.message
    );
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (error) {
    throw new ApiError(
      "Error sending password reset success email",
      500,
      error.message
    );
  }
};
export const sendPasswordChangeSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Change Successful",
      html: PASSWORD_CHANGE_SUCCESS_TEMPLATE,
      category: "Password Change",
    });
  } catch (error) {
    throw new ApiError(
      "Error sending password change success email",
      500,
      error.message
    );
  }
};

export const sendFriendRequestEmail = async (
  recipientEmail,
  recipientName,
  senderName,
  senderNativeLanguage,
  senderLearningLanguage
) => {
  const recipient = [{ email: recipientEmail }];
  const appURL = process.env.CLIENT_URL || "http://localhost:5173";

  const html = FRIEND_REQUEST_TEMPLATE.replace(
    /{recipientName}/g,
    recipientName
  )
    .replace(/{senderName}/g, senderName)
    .replace(/{senderNativeLanguage}/g, senderNativeLanguage || "Not specified")
    .replace(
      /{senderLearningLanguage}/g,
      senderLearningLanguage || "Not specified"
    )
    .replace(/{appURL}/g, appURL);

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `New Friend Request from ${senderName}`,
      html,
      category: "Friend Request",
    });
  } catch (error) {
    throw new ApiError(
      "Error sending friend request email",
      500,
      error.message
    );
  }
};

export const sendUnreadMessageEmail = async (
  userEmail,
  userName,
  unreadCount,
  senderNames
) => {
  const recipient = [{ email: userEmail }];
  const appURL = process.env.CLIENT_URL || "http://localhost:5173";

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `You have ${unreadCount} unread message${
        unreadCount > 1 ? "s" : ""
      }`,
      html: UNREAD_MESSAGE_TEMPLATE.replace("{userName}", userName)
        .replace("{unreadCount}", unreadCount)
        .replace("{senderNames}", senderNames)
        .replace("{appURL}", appURL),
      category: "Unread Messages",
    });
  } catch (error) {
    throw new ApiError(
      "Error sending unread message email",
      500,
      error.message
    );
  }
};
