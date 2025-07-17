import Joi from "joi";
export const authValidation = {
  signup: Joi.object({
    fullName: Joi.string().required().messages({
      "any.required": "Full Name is required",
      "string.empty": "Full Name cannot be empty",
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
    bio: Joi.string().max(500).trim().optional().messages({
      "string.max": "Bio cannot exceed 500 characters",
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

  onboarding: Joi.object({
    fullName: Joi.string().required().messages({
      "string.empty": "Full name cannot be empty",
      "any.required": "Full name is required",
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
  }),
};
