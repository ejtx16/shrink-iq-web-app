import { body, param } from "express-validator";

export const validateRegister = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one letter and one number"),
];

export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validateShortenUrl = [
  body("originalUrl")
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
    })
    .withMessage("Please provide a valid URL with http:// or https://"),
  body("customSlug")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Custom slug must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Custom slug can only contain letters, numbers, hyphens, and underscores"),
];

export const validateShortCode = [
  param("shortCode")
    .notEmpty()
    .withMessage("Short code is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Short code must be between 3 and 50 characters"),
];

export const validateObjectId = [param("id").isMongoId().withMessage("Invalid ID format")];
