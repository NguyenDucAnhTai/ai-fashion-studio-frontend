import { type ReactElement } from "react";
import AdminDashboardPage from "../features/admin/AdminDashboardPage";
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
import { ROLE_GROUPS } from "../shared/constants/roleGroups";
import type { Role } from "../shared/constants/roles";

export interface RouteAccessEntry {
  /** Path relative to MainLayout ("" means index). */
  path: string;
  element: ReactElement;
  /** Roles allowed to view this route. Omit for public routes. */
  roles?: Role[];
}

/**
 * Single source of truth for which role can access which route under MainLayout.
 * Add a route here once and both the router and any access audit read from it.
 */
export const ROUTE_ACCESS: RouteAccessEntry[] = [
  { path: "", element: <LandingPage /> },
  { path: "products", element: <ProductListPage /> },
  { path: "products/:productId", element: <ProductDetailPage /> },
  { path: "about-us", element: <AboutUsPage /> },
  { path: "feedbacks", element: <PublicFeedbackList /> },
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "verify-reset-otp", element: <VerifyResetOtpPage /> },
  { path: "reset-password", element: <ResetPasswordPage /> },
  { path: "profile", element: <ProfilePage /> },
  { path: "profile/edit", element: <EditProfilePage /> },
  {
    path: "designs/my",
    element: <MyDesignsPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "designs/:designId/editor",
    element: <DesignEditorPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "tryon/:designId",
    element: <TryOnPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "tryon/result/:requestId",
    element: <TryOnResultPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "checkout/:designId",
    element: <CheckoutPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "payment/:orderId",
    element: <PaymentPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "payment/success",
    element: <PaymentSuccessPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "payment/cancel",
    element: <PaymentCancelPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "orders/my",
    element: <MyOrdersPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "orders/:orderId",
    element: <OrderDetailPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "orders/:orderId/feedback",
    element: <SubmitFeedbackPage />,
    roles: ROLE_GROUPS.customerOnly,
  },
  {
    path: "staff",
    element: <StaffDashboardPage />,
    roles: ROLE_GROUPS.staffAndAdmin,
  },
  {
    path: "staff/orders",
    element: <StaffOrderListPage />,
    roles: ROLE_GROUPS.staffAndAdmin,
  },
  {
    path: "staff/orders/:orderId",
    element: <StaffOrderDetailPage />,
    roles: ROLE_GROUPS.staffAndAdmin,
  },
  {
    path: "staff/orders/:orderId/print-info",
    element: <PrintInfoPage />,
    roles: ROLE_GROUPS.staffAndAdmin,
  },
  {
    path: "staff/orders/:orderId/print",
    element: <PrintInfoPage />,
    roles: ROLE_GROUPS.staffAndAdmin,
  },
  {
    path: "staff/feedbacks",
    element: <FeedbackModerationPage />,
    roles: ROLE_GROUPS.staffAndAdmin,
  },
  {
    path: "admin",
    element: <AdminDashboardPage />,
    roles: ROLE_GROUPS.adminOnly,
  },
  {
    path: "admin/catalogs",
    element: <CatalogManagementPage />,
    roles: ROLE_GROUPS.adminOnly,
  },
];
