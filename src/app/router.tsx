import { createBrowserRouter, type RouteObject } from "react-router-dom";
import AdminLoginPage from "../features/admin/AdminLoginPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import RoleGuard from "../shared/components/RoleGuard";
import MainLayout from "../shared/layouts/MainLayout";
import { ROUTE_ACCESS } from "./routeAccess";

function toRouteObject({ path, element, roles }: (typeof ROUTE_ACCESS)[number]): RouteObject {
  const guardedElement = roles ? <RoleGuard allowedRoles={roles}>{element}</RoleGuard> : element;
  const finalElement = roles ? <ProtectedRoute>{guardedElement}</ProtectedRoute> : guardedElement;

  return path === "" ? { index: true, element: finalElement } : { path, element: finalElement };
}

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLoginPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: ROUTE_ACCESS.map(toRouteObject),
  },
]);
