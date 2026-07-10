import { z } from "zod";

export function createCheckoutSchema(maxQuantity: number) {
  return z.object({
    receiverName: z.string().trim().min(2, "Receiver name must be at least 2 characters"),
    receiverPhone: z
      .string()
      .trim()
      .regex(/^(\+84|0)\d{9,10}$/, "Enter a valid phone number"),
    shippingAddress: z.string().trim().min(5, "Shipping address must be at least 5 characters"),
    quantity: z.coerce
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(maxQuantity, `Only ${maxQuantity} in stock`),
  });
}

export type CheckoutInputValues = z.input<ReturnType<typeof createCheckoutSchema>>;
export type CheckoutFormValues = z.output<ReturnType<typeof createCheckoutSchema>>;
