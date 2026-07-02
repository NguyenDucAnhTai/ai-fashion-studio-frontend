import { z } from "zod";

export const tryOnSchema = z.object({
  heightCm: z.coerce.number().min(80, "Height must be at least 80 cm").max(250, "Height must be at most 250 cm"),
  weightKg: z.coerce.number().min(20, "Weight must be at least 20 kg").max(300, "Weight must be at most 300 kg"),
});

export type TryOnFormValues = z.infer<typeof tryOnSchema>;
