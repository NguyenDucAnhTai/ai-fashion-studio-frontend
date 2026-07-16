import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import AiChatWidget from "../../features/aiChat/AiChatWidget";
import Navbar from "../../features/landing/components/Navbar";

interface MainLayoutProps {
  children?: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children ?? <Outlet />}</main>
      <AiChatWidget />
    </div>
  );
}
