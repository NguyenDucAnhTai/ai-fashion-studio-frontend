import type { BadgeTone } from "../types";

export const PAYMENT_STATUS = {
  pending: "PENDING",
  paid: "PAID",
  failed: "FAILED",
  cancelled: "CANCELLED",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS] | string;

export function getPaymentStatusTone(status: PaymentStatus): BadgeTone {
  if (status === PAYMENT_STATUS.paid) {
    return "success";
  }

  if (status === PAYMENT_STATUS.failed || status === PAYMENT_STATUS.cancelled) {
    return "error";
  }

  return "warning";
}
