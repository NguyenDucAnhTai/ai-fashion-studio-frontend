import { z } from "zod";

export const submitFeedbackSchema = z.object({
  rating: z.number().min(1, "Choose at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  comment: z.string().trim().max(1000, "Comment must be at most 1000 characters").optional(),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().url().safeParse(value).success, "Enter a valid image URL"),
});

export type SubmitFeedbackFormValues = z.infer<typeof submitFeedbackSchema>;

export const moderateFeedbackSchema = z.object({
  feedbackId: z.string().trim().min(1, "Feedback ID is required"),
  note: z.string().trim().max(500, "Note must be at most 500 characters").optional(),
});

export type ModerateFeedbackFormValues = z.infer<typeof moderateFeedbackSchema>;
