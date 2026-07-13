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
import { ROLES } from "../../../shared/constants/roles";
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
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 18);
        ticking = false;
      });
    };

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
  const avatarUrl = currentUser?.avatarUrl;

  const isStaffOrAdmin =
    userRoles.includes(ROLES.staff) || userRoles.includes(ROLES.admin);

  const shoppingBagHref =
    currentUser && isStaffOrAdmin ? dashboardHref : "/products";

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          "border-b border-white/30 bg-white/75 backdrop-blur-xl",
          scrolled ? "shadow-[0_10px_35px_rgba(15,23,42,0.08)]" : "shadow-none",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center lg:h-[68px]">
            <div className="mr-7 flex-shrink-0 lg:mr-10 xl:mr-12">
              <Logo />
            </div>

            <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
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
                      "flex items-center gap-1.5 text-sm font-semibold text-primary-800 transition-colors duration-200 hover:text-primary-950 xl:text-[15px]",
                      activeMenu === item.label ? "text-primary-950" : "",
                    ].join(" ")}
                  >
                    {item.label}

                    {item.dropdown && (
                      <ChevronDown
                        size={15}
                        strokeWidth={2.2}
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

            <div className="ml-auto flex items-center gap-2.5">
              <div className="hidden items-center gap-4 lg:flex">
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex max-w-[210px] items-center gap-2 truncate text-sm font-semibold text-primary-800 transition-colors hover:text-primary-950"
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={accountLabel}
                          className="h-7 w-7 rounded-full border border-primary-100 object-cover"
                        />
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                          <UserRound size={15} />
                        </span>
                      )}

                      <span className="truncate">{accountLabel}</span>
                    </Link>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-950"
                      onClick={handleLogout}
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="relative text-sm font-semibold text-primary-800 transition-colors hover:text-primary-950 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary-950 after:transition-all after:duration-300 hover:after:w-full"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="rounded-full bg-primary-950 px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-[0_10px_25px_rgba(0,0,0,0.16)] active:translate-y-0"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              <Link
                to={shoppingBagHref}
                aria-label="Product catalog"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-primary-800 transition-colors hover:bg-primary-100 hover:text-primary-950"
              >
                <ShoppingBag size={17} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-400" />
              </Link>

              <button
                type="button"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileOpen((open) => !open)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-primary-800 transition-colors hover:bg-primary-100 hover:text-primary-950 lg:hidden"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-30 transition-all duration-300 lg:hidden",
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
                  to="/profile"
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
