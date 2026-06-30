import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import Logo from "../../../shared/components/Logo";
import Button from "../../../shared/components/Button";
import MegaMenu from "./MegaMenu";
import { NAV_ITEMS } from "../../../shared/constants/navItems";

export default function Navbar() {
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
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 120);
  };

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",

          "bg-white/35",

          "backdrop-blur-[24px]",
          "supports-[backdrop-filter]:backdrop-blur-[24px]",

          "border-b border-white/20",

          "before:absolute before:inset-0",
          "before:bg-gradient-to-r",
          "before:from-white/20",
          "before:via-white/5",
          "before:to-white/20",

          scrolled ? "shadow-[0_12px_40px_rgba(0,0,0,0.08)]" : "",
        ].join(" ")}
      >
        <div className="mx-auto max-w-[1780px] px-8 lg:px-14">
          <div className="flex items-center h-[72px]">
            {/* Logo */}
            <div className="flex-shrink-0 mr-24">
              <Logo />
            </div>

            {/* Center nav */}
            <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.dropdown ? handleMouseEnter(item.label) : undefined
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={item.href}
                    className={[
                      "flex items-center gap-1.5 text-[16px] font-medium text-[#1f2937]",
                      "transition-colors duration-200 hover:text-black",
                      activeMenu === item.label ? "text-black" : "",
                    ].join(" ")}
                    onClick={(e) => item.dropdown && e.preventDefault()}
                  >
                    {item.label}
                    {item.dropdown && (
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className={[
                          "transition-transform duration-200",
                          activeMenu === item.label ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    )}
                  </a>

                  {item.dropdown && (
                    <MegaMenu
                      items={item.dropdown}
                      isVisible={activeMenu === item.label}
                    />
                  )}
                </div>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-6 ml-20">
                <Button
                  variant="ghost"
                  className="
      relative px-0 text-[16px] font-medium text-[#1f2937]
      hover:text-black
      after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
      after:bg-black after:transition-all after:duration-300
      hover:after:w-full
    "
                >
                  Login
                </Button>

                <Button
                  variant="custom"
                  className="
    h-12 px-7 rounded-full bg-[#DFFF4F] text-black text-[15px] font-bold
    transition-all duration-300 ease-out
    hover:bg-black hover:text-white
    hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]
    hover:-translate-y-0.5
    active:translate-y-0
  "
                >
                  Sign Up →
                </Button>
              </div>

              <button
                aria-label="Shopping cart"
                className="relative flex items-center justify-center w-10 h-10 text-[#1f2937] hover:text-black transition-colors"
              >
                <ShoppingBag size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-400" />
              </button>
              <button
                aria-label="Shopping cart"
                className="relative flex items-center justify-center w-10 h-10 text-[#1f2937] hover:text-black transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
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
            "absolute top-16 left-0 right-0 bg-white border-b border-primary-100 shadow-large transition-all duration-300",
            mobileOpen ? "translate-y-0" : "-translate-y-4",
          ].join(" ")}
        >
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2.5 text-sm font-medium text-primary-800 hover:bg-beige-100 rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-3 border-t border-primary-100">
              <Button variant="outline" size="sm" className="flex-1">
                Login
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                Sign Up
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
