import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .max(64, {
    message: "Password cannot exceed 64 characters",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /\d/.test(password), {
    message: "Password must contain at least one number",
  })
  .refine((password) => /[^a-zA-Z\d]/.test(password), {
    message: "Password must contain at least one special character",
  });

const validateCommaSeparatedWords = (str: string) => {
  const words = str.split(",").map((word) => word.trim());
  return (
    words.length === 10 &&
    new Set(words).size === 10 &&
    words.every((word) => word.trim().length >= 4)
  );
};

const commaSeparatedWordsSchema = z
  .string()
  .refine((value) => validateCommaSeparatedWords(value), {
    message:
      "The input should be a string containing 10 distinct words separated by commas, with each word being at least 4 characters long.",
  });

export const secureAptosAccountSchema = z.object({
  accessCode: passwordSchema,
  catchPhrases: commaSeparatedWordsSchema,
});
