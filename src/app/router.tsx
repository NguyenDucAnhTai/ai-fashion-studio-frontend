import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../shared/layouts/MainLayout";
import LandingPage from "../features/landing/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
]);
