import {
  Boxes,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PackageSearch,
  Search,
  Store,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../features/auth/api";
import { useAuthStore } from "../../features/auth/authStore";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, end: true },
  { label: "Catalogs", href: "/admin/catalogs", icon: Boxes },
  { label: "Storefront Products", href: "/products", icon: PackageSearch },
  { label: "Staff Orders", href: "/staff/orders", icon: ClipboardList },
  { label: "Feedback Review", href: "/staff/feedbacks", icon: MessageSquare },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const logoutMutation = useLogoutMutation();

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith("/admin/catalogs")) {
      return "Catalog Management";
    }

    if (location.pathname.startsWith("/admin/products")) {
      return "Product Management";
    }

    return "Admin Dashboard";
  }, [location.pathname]);

  const userName = currentUser?.fullName ?? currentUser?.email ?? "Admin";
  const userEmail = currentUser?.email ?? "admin workspace";
  const avatarInitial = userName.trim().charAt(0).toUpperCase() || "A";

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutMutation.mutate(refreshToken, {
      onSettled: () => {
        clearSession();
        navigate("/");
      },
    });
  };

  const sidebar = (
    <div className="flex min-h-full flex-col px-4 py-5">
      <Link to="/admin" className="group flex items-center gap-3 rounded-2xl px-2 py-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary-950 shadow-sm transition group-hover:scale-95">
          <Store size={20} />
        </span>
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
            Fitwear
          </span>
          <span className="mt-0.5 block text-lg font-semibold text-white">Admin</span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1" aria-label="Admin navigation">
        {adminLinks.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                  isActive
                    ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-white/62 hover:bg-white/[0.07] hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
          Workspace
        </p>
        <p className="mt-2 text-sm leading-6 text-white/68">
          Catalogs, staff orders, and feedback review stay separated from the public store.
        </p>
      </div>

      <div className="mt-auto border-t border-white/10 pt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-white">
            {avatarInitial}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">{userName}</span>
            <span className="block truncate text-xs text-white/45">{userEmail}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary-950 transition hover:bg-accent-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={logoutMutation.isPending}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] bg-primary-950 text-white lg:block">
        {sidebar}
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            className="absolute inset-0 bg-primary-950/55"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="relative h-full w-[min(86vw,296px)] bg-primary-950 text-white shadow-large">
            <button
              type="button"
              aria-label="Close admin menu"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-3 top-3 rounded-xl p-2 text-white/65 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="min-h-screen lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Open admin menu"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Fitwear Studio
              </p>
              <h1 className="mt-1 truncate text-xl font-semibold text-slate-950 sm:text-2xl">
                {pageTitle}
              </h1>
            </div>

            <div className="hidden w-full max-w-xs items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-400 shadow-sm md:flex">
              <Search size={16} />
              <input
                type="search"
                aria-label="Admin search"
                placeholder="Search workspace"
                className="h-8 min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <Link
              to="/"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 sm:inline-flex"
            >
              <Home size={16} />
              Back to Store
            </Link>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-950 text-sm font-semibold text-white">
              {avatarInitial}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
