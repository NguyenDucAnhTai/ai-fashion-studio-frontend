import { ROLES, type Role } from "../../shared/constants/roles";
interface RoleCarrier {
  role?: Role;
  roles?: Role[];
}

const CUSTOMER_PREFIXES = [
  "/designs",
  "/tryon",
  "/checkout",
  "/payment",
  "/orders",
];

const AUTH_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-reset-otp",
  "/reset-password",
];

export function getUserRoles(user?: RoleCarrier | null) {
  if (!user) {
    return [];
  }

  return user.roles?.length ? user.roles : user.role ? [user.role] : [];
}

export function getRoleRedirect(roles: Role[]) {
  if (roles.includes(ROLES.admin)) {
    return "/admin";
  }

  if (roles.includes(ROLES.staff)) {
    return "/staff";
  }

  return "/";
}

export function isRedirectAllowedForRoles(path: string, roles: Role[]) {
  if (!path || AUTH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return false;
  }

  if (path.startsWith("/admin")) {
    return roles.includes(ROLES.admin);
  }

  if (path.startsWith("/staff")) {
    return roles.includes(ROLES.staff) || roles.includes(ROLES.admin);
  }

  if (CUSTOMER_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return roles.includes(ROLES.customer);
  }

  return true;
}
