import { ROLES, type Role } from "./roles";

export const ROLE_GROUPS = {
  customerOnly: [ROLES.customer],
  staffAndAdmin: [ROLES.staff, ROLES.admin],
  adminOnly: [ROLES.admin],
} satisfies Record<string, Role[]>;
