import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return children;
}
