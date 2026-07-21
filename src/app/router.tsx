import { type ReactElement } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminDashboardPage from "../features/admin/AdminDashboardPage";
import AdminLoginPage from "../features/admin/AdminLoginPage";
import CatalogManagementPage from "../features/admin/catalog/CatalogManagementPage";
import AboutUsPage from "../features/about/AboutUsPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ResetPasswordPage from "../features/auth/ResetPasswordPage";
import VerifyResetOtpPage from "../features/auth/VerifyResetOtpPage";
import ProductDetailPage from "../features/catalog/ProductDetailPage";
import ProductListPage from "../features/catalog/ProductListPage";
import DesignEditorPage from "../features/design/DesignEditorPage";
import MyDesignsPage from "../features/design/MyDesignsPage";
import FeedbackModerationPage from "../features/feedback/FeedbackModerationPage";
import PublicFeedbackList from "../features/feedback/PublicFeedbackList";
import SubmitFeedbackPage from "../features/feedback/SubmitFeedbackPage";
import LandingPage from "../features/landing/LandingPage";
import CheckoutPage from "../features/order/CheckoutPage";
import MyOrdersPage from "../features/order/MyOrdersPage";
import OrderDetailPage from "../features/order/OrderDetailPage";
import PaymentCancelPage from "../features/payment/PaymentCancelPage";
import PaymentPage from "../features/payment/PaymentPage";
import PaymentSuccessPage from "../features/payment/PaymentSuccessPage";
import PrintInfoPage from "../features/staff/PrintInfoPage";
import StaffDashboardPage from "../features/staff/StaffDashboardPage";
import StaffOrderDetailPage from "../features/staff/StaffOrderDetailPage";
import StaffOrderListPage from "../features/staff/StaffOrderListPage";
import TryOnPage from "../features/tryon/TryOnPage";
import TryOnResultPage from "../features/tryon/TryOnResultPage";
import EditProfilePage from "../features/user/EditProfilePage";
import ProfilePage from "../features/user/ProfilePage";
import GuestRoute from "../shared/components/GuestRoute";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import RoleGuard from "../shared/components/RoleGuard";
import { ROLES, type Role } from "../shared/constants/roles";
import AdminLayout from "../shared/layouts/AdminLayout";
import MainLayout from "../shared/layouts/MainLayout";
import StaffLayout from "../shared/layouts/StaffLayout";

const customerOnly: Role[] = [ROLES.customer];
const staffRoles: Role[] = [ROLES.staff, ROLES.admin];
const adminOnly: Role[] = [ROLES.admin];

function protect(element: ReactElement, roles?: Role[]) {
  const guardedElement = roles ? (
    <RoleGuard allowedRoles={roles}>{element}</RoleGuard>
  ) : (
    element
  );
  return <ProtectedRoute>{guardedElement}</ProtectedRoute>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "products", element: <ProductListPage /> },
      { path: "products/:productId", element: <ProductDetailPage /> },
      { path: "about-us", element: <AboutUsPage /> },
      { path: "feedbacks", element: <PublicFeedbackList /> },
      { path: "login", element: <GuestRoute><LoginPage /></GuestRoute> },
      { path: "register", element: <GuestRoute><RegisterPage /></GuestRoute> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "verify-reset-otp", element: <VerifyResetOtpPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "profile", element: protect(<ProfilePage />) },
      { path: "profile/edit", element: protect(<EditProfilePage />) },
      { path: "designs/my", element: protect(<MyDesignsPage />, customerOnly) },
      {
        path: "designs/:designId/editor",
        element: protect(<DesignEditorPage />, customerOnly),
      },
      {
        path: "tryon/:designId",
        element: protect(<TryOnPage />, customerOnly),
      },
      {
        path: "tryon/result/:requestId",
        element: protect(<TryOnResultPage />, customerOnly),
      },
      {
        path: "checkout/:designId",
        element: protect(<CheckoutPage />, customerOnly),
      },
      {
        path: "checkout",
        element: protect(<CheckoutPage />, customerOnly),
      },
      {
        path: "payment/:orderId",
        element: protect(<PaymentPage />, customerOnly),
      },
      {
        path: "payment/success",
        element: protect(<PaymentSuccessPage />, customerOnly),
      },
      {
        path: "payment/cancel",
        element: protect(<PaymentCancelPage />, customerOnly),
      },
      { path: "orders/my", element: protect(<MyOrdersPage />, customerOnly) },
      {
        path: "orders/:orderId",
        element: protect(<OrderDetailPage />, customerOnly),
      },
      {
        path: "orders/:orderId/feedback",
        element: protect(<SubmitFeedbackPage />, customerOnly),
      },
    ],
  },
  { path: "/admin/login", element: <GuestRoute><AdminLoginPage /></GuestRoute> },
  {
    path: "/admin",
    element: protect(<AdminLayout />, adminOnly),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "dashboard", element: <Navigate to="/admin" replace /> },
      { path: "catalogs", element: <CatalogManagementPage /> },
      { path: "products", element: <Navigate to="/admin/catalogs" replace /> },
    ],
  },
  {
    path: "/staff",
    element: protect(<StaffLayout />, staffRoles),
    children: [
      { index: true, element: <StaffDashboardPage /> },
      { path: "orders", element: <StaffOrderListPage /> },
      { path: "orders/:orderId", element: <StaffOrderDetailPage /> },
      { path: "orders/:orderId/print-info", element: <PrintInfoPage /> },
      { path: "orders/:orderId/print", element: <PrintInfoPage /> },
      { path: "feedbacks", element: <FeedbackModerationPage /> },
    ],
  },
]);
