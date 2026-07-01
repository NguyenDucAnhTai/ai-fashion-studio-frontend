import { createBrowserRouter } from "react-router-dom";
import AboutUsPage from "../features/about/AboutUsPage";
import ProductDetailPage from "../features/catalog/ProductDetailPage";
import ProductListPage from "../features/catalog/ProductListPage";
import PublicFeedbackList from "../features/feedback/PublicFeedbackList";
import LandingPage from "../features/landing/LandingPage";
import MainLayout from "../shared/layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "products",
        element: <ProductListPage />,
      },
      {
        path: "products/:productId",
        element: <ProductDetailPage />,
      },
      {
        path: "about-us",
        element: <AboutUsPage />,
      },
      {
        path: "feedbacks",
        element: <PublicFeedbackList />,
      },
    ],
  },
]);
