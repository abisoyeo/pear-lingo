import Joi from "joi";
export const authValidation = {
  signup: Joi.object({
    fullName: Joi.string().trim().min(1).required().messages({
      "string.empty": "Full Name cannot be empty",
      "string.min": "Full Name cannot be empty",
      "any.required": "Full Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
    }),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().min(6).required().messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
    newPassword: Joi.string().min(6).required().messages({
      "string.empty": "New Password cannot be empty",
      "string.min": "New Password must be at least 6 characters",
      "any.required": "New Password is required",
    }),
  }),

  resetPassword: Joi.object({
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  }),

  verifyEmail: Joi.object({
    code: Joi.string().trim().length(6).required().messages({
      "string.empty": "Verification code cannot be empty",
      "string.length": "Verification code must be 6 characters",
      "any.required": "Verification code is required",
    }),
  }),
  onboarding: Joi.object({
    fullName: Joi.string().trim().min(1).required().messages({
      "string.empty": "Full Name cannot be empty",
      "string.min": "Full Name cannot be empty",
      "any.required": "Full Name is required",
    }),

    bio: Joi.string().required().messages({
      "string.empty": "Bio cannot be empty",
      "any.required": "Bio is required",
    }),

    nativeLanguage: Joi.string().required().messages({
      "string.empty": "Native language cannot be empty",
      "any.required": "Native language is required",
    }),

    learningLanguage: Joi.string().required().messages({
      "string.empty": "Learning language cannot be empty",
      "any.required": "Learning language is required",
    }),

    location: Joi.string().required().messages({
      "string.empty": "Location cannot be empty",
      "any.required": "Location is required",
    }),

    profilePic: Joi.string().uri().required().messages({
      "string.base": "Profile picture must be a string.",
      "string.uri": "Profile picture must be a valid URL.",
      "any.required": "Profile picture is required.",
    }),
  }),
};
