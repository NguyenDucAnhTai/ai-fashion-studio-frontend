import type { BadgeTone } from "../types";

export const ORDER_STATUS = {
  pendingPayment: "PENDING_PAYMENT",
  paid: "PAID",
  inProduction: "IN_PRODUCTION",
  shipping: "SHIPPING",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS] | string;

export function getOrderStatusTone(status: OrderStatus): BadgeTone {
  if (status === ORDER_STATUS.completed) {
    return "success";
  }

  if (status === ORDER_STATUS.cancelled) {
    return "error";
  }

  if (status === ORDER_STATUS.paid || status === ORDER_STATUS.inProduction || status === ORDER_STATUS.shipping) {
    return "accent";
  }

  return "warning";
}

export function getNextOrderStatus(status: OrderStatus) {
  if (status === ORDER_STATUS.paid) {
    return ORDER_STATUS.inProduction;
  }

  if (status === ORDER_STATUS.inProduction) {
    return ORDER_STATUS.shipping;
  }

  if (status === ORDER_STATUS.shipping) {
    return ORDER_STATUS.completed;
  }

  return null;
}
