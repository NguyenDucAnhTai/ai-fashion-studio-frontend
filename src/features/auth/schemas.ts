import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^(\+84|0)\d{9,10}$/.test(value), "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const verifyResetOtpSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  otp: z.string().trim().min(1, "OTP is required"),
});

export type VerifyResetOtpFormValues = z.infer<typeof verifyResetOtpSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  otp: z.string().trim().min(1, "OTP is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
