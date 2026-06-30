import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../features/landing/components/Navbar";

interface MainLayoutProps {
  children?: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children ?? <Outlet />}</main>
    </div>
  );
}
