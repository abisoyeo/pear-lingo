import Joi from "joi";

export const authValidation = {
  signup: Joi.object({
    fullName: Joi.string().trim().min(1).required().messages({
      "string.empty": "Full Name cannot be empty",
      "string.min": "Full Name cannot be empty",
      "any.required": "Full Name is required",
    }),
    email: Joi.string().trim().email().required().messages({
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
    email: Joi.string().trim().email().required().messages({
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
    bio: Joi.string().trim().required().messages({
      "string.empty": "Bio cannot be empty",
      "any.required": "Bio is required",
    }),
    nativeLanguage: Joi.string().trim().required().messages({
      "string.empty": "Native language cannot be empty",
      "any.required": "Native language is required",
    }),
    learningLanguage: Joi.string().trim().required().messages({
      "string.empty": "Learning language cannot be empty",
      "any.required": "Learning language is required",
    }),
    location: Joi.string().trim().required().messages({
      "string.empty": "Location cannot be empty",
      "any.required": "Location is required",
    }),
  }),
};
