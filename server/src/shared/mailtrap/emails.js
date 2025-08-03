import ApiError from "../utils/apiError.util.js";
import {
  PASSWORD_CHANGE_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
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
      template_uuid: "0cac693c-dc72-4084-8364-bfad49a07de3",
      template_variables: {
        company_info_name: "Edupeerhub",
        name: name,
        company_info_address: "123, Ikeja",
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
