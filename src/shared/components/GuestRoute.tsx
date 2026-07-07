import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";
import { getRoleRedirect, getUserRoles } from "../../features/auth/roleRedirect";
import { ROLES } from "../constants/roles";
import Loading from "./Loading";

interface GuestRouteProps {
  children: ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!hydrated) {
    return <Loading label="Restoring session..." />;
  }

  if (isAuthenticated || accessToken || currentUser) {
    const roles = getUserRoles(currentUser);
    return (
      <Navigate
        to={getRoleRedirect(roles.length ? roles : [ROLES.customer])}
        replace
      />
    );
  }

  return children;
}
