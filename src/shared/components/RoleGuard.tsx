import { type ReactNode } from "react";
import { useAuthStore } from "../../features/auth/authStore";
import ErrorState from "./ErrorState";
import type { Role } from "../constants/roles";

interface StoredUser {
  roles?: Role[];
}

interface RoleGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
}

function getStoredUser() {
  const rawUser = localStorage.getItem("currentUser");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    return null;
  }
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const storeUser = useAuthStore((state) => state.currentUser);
  const user = storeUser ?? getStoredUser();
  const roles = user?.roles ?? [];
  const canAccess = roles.some((role) => allowedRoles.includes(role));

  if (!canAccess) {
    return (
      <ErrorState
        title="403 Forbidden"
        description="Your account does not have permission to view this page."
      />
    );
  }

  return children;
}
