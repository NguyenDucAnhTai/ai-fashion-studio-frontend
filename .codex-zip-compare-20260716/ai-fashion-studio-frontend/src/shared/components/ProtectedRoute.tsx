import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";
import { ROUTES } from "../constants/routes";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken =
    useAuthStore((state) => state.accessToken) ?? localStorage.getItem("accessToken");
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hydrated) {
    return <Loading label="Restoring session..." />;
  }

  if (!isAuthenticated && !accessToken && !currentUser) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return children;
}
