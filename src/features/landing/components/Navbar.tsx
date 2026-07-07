import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../auth/api";
import { useAuthStore } from "../../auth/authStore";
import { getRoleRedirect, getUserRoles } from "../../auth/roleRedirect";
import Logo from "../../../shared/components/Logo";
import { NAV_ITEMS } from "../../../shared/constants/navItems";
import MegaMenu from "./MegaMenu";

export default function Navbar() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const logoutMutation = useLogoutMutation();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (menuTimeout.current) {
      clearTimeout(menuTimeout.current);
    }
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const handleLogout = () => {
    logoutMutation.mutate(refreshToken, {
      onSettled: () => {
        clearSession();
        navigate("/");
      },
    });
  };

  const userRoles = getUserRoles(currentUser);
  const dashboardHref = currentUser ? getRoleRedirect(userRoles) : "/";
  const accountLabel = currentUser?.fullName ?? currentUser?.email ?? "Account";

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          "bg-white/35 backdrop-blur-[24px] supports-[backdrop-filter]:backdrop-blur-[24px]",
          "border-b border-white/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-white/5 before:to-white/20",
          scrolled ? "shadow-[0_12px_40px_rgba(0,0,0,0.08)]" : "",
        ].join(" ")}
      >
        <div className="relative mx-auto max-w-[1780px] px-6 sm:px-10 lg:px-16">
          <div className="flex h-[84px] items-center">
            <div className="mr-12 flex-shrink-0 lg:mr-24">
              <Logo />
            </div>

            <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.dropdown && handleMouseEnter(item.label)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.href}
                    className={[
                      "flex items-center gap-2 text-[17px] font-semibold text-[#1f2937] transition-colors duration-200 hover:text-black",
                      activeMenu === item.label ? "text-black" : "",
                    ].join(" ")}
                  >
                    {item.label}
                    {item.dropdown && (
                      <ChevronDown
                        size={18}
                        strokeWidth={2}
                        className={[
                          "transition-transform duration-200",
                          activeMenu === item.label ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    )}
                  </Link>

                  {item.dropdown && (
                    <MegaMenu
                      items={item.dropdown}
                      isVisible={activeMenu === item.label}
                    />
                  )}
                </div>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden items-center gap-6 lg:flex">
                {currentUser ? (
                  <>
                    <Link
                      to={dashboardHref}
                      className="flex items-center gap-2 text-[15px] font-semibold text-[#1f2937] transition-colors hover:text-black"
                    >
                      <UserRound size={16} />
                      {accountLabel}
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-[15px] font-semibold text-primary-500 transition-colors hover:text-primary-950"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="relative text-[16px] font-medium text-[#1f2937] transition-colors hover:text-black after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="h-12 rounded-full bg-[#DFFF4F] px-7 py-3 text-[15px] font-bold text-black transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] active:translate-y-0"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              <Link
                to={currentUser ? dashboardHref : "/products"}
                aria-label="Product catalog"
                className="relative flex h-10 w-10 items-center justify-center text-[#1f2937] transition-colors hover:text-black"
              >
                <ShoppingBag size={18} />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-400" />
              </Link>
              <button
                type="button"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileOpen((open) => !open)}
                className="relative flex h-10 w-10 items-center justify-center text-[#1f2937] transition-colors hover:text-black lg:hidden"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-30 lg:hidden transition-all duration-300",
          mobileOpen ? "visible opacity-100" : "invisible opacity-0",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={[
            "absolute left-0 right-0 top-16 border-b border-primary-100 bg-white shadow-large transition-all duration-300",
            mobileOpen ? "translate-y-0" : "-translate-y-4",
          ].join(" ")}
        >
          <div className="space-y-1 px-4 py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-primary-800 transition-colors hover:bg-beige-100"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {currentUser ? (
              <div className="grid gap-2 border-t border-primary-100 pt-3">
                <Link
                  to={dashboardHref}
                  className="rounded-full border border-primary-900 px-4 py-2 text-center text-sm font-medium text-primary-900 transition hover:bg-primary-900 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {accountLabel}
                </Link>
                <button
                  type="button"
                  className="rounded-full bg-primary-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-primary-700"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2 border-t border-primary-100 pt-3">
                <Link
                  to="/login"
                  className="flex-1 rounded-full border border-primary-900 px-4 py-2 text-center text-sm font-medium text-primary-900 transition hover:bg-primary-900 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 rounded-full bg-primary-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-primary-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
