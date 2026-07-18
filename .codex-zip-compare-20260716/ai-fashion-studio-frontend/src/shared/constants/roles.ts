export const ROLES = {
  customer: "CUSTOMER",
  staff: "STAFF",
  admin: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
