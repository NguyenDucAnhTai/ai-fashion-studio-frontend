import { ClipboardList, Home, LayoutDashboard, LogOut, MessageSquare } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../features/auth/api";
import { useAuthStore } from "../../features/auth/authStore";

const staffLinks = [
  { label: "Staff Dashboard", href: "/staff", icon: LayoutDashboard, end: true },
  { label: "Orders", href: "/staff/orders", icon: ClipboardList },
  { label: "Feedbacks", href: "/staff/feedbacks", icon: MessageSquare },
];

export default function StaffLayout() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(refreshToken, {
      onSettled: () => {
        clearSession();
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-beige-50 lg:flex">
      <aside className="bg-primary-950 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-[260px]">
        <div className="flex min-h-full flex-col px-5 py-5">
          <div className="flex items-center justify-between gap-3 lg:block">
            <Link to="/staff" className="block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                Fitwear Studio
              </p>
              <h1 className="mt-2 text-xl font-semibold">Staff Workspace</h1>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white hover:text-primary-950 lg:mt-5"
            >
              <Home size={14} />
              Store
            </Link>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {staffLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "inline-flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      isActive
                        ? "bg-white text-primary-950"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon size={17} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-5 border-t border-white/10 pt-5 lg:mt-auto">
            <p className="truncate text-sm font-semibold">
              {currentUser?.fullName ?? currentUser?.email ?? "Staff"}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-primary-950 transition hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={logoutMutation.isPending}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 lg:ml-[260px]">
        <Outlet />
      </main>
    </div>
  );
}
