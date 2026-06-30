import { Scissors, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop/new" },
      { label: "Collections", href: "/collections" },
      { label: "Outfit Builder", href: "/studio/builder" },
      { label: "Size Guide", href: "/individuals/size-guide" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Fashion Coach", href: "/studio/coach" },
      { label: "2D Fit Preview", href: "/individuals/fit-preview" },
      { label: "Customization Studio", href: "/studio" },
      { label: "Customer Support", href: "/support" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/about/contact" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Sign Up", href: "/signup" },
      { label: "Orders", href: "/account/orders" },
      { label: "Saved Designs", href: "/studio/saved" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "X (Twitter)", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-primary-100">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand column — spans 2 */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5 group w-fit">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-900 group-hover:scale-110 transition-transform">
                <Scissors size={15} className="text-white" strokeWidth={2} />
              </span>
              <span className="font-display text-lg font-semibold text-primary-900 leading-none">
                Fitwear<span className="text-accent-400"> Studio</span>
              </span>
            </Link>

            <p className="text-sm text-primary-500 leading-relaxed max-w-xs mb-6">
              Personalized fashion shopping, outfit customization, and 2D fit
              preview for confident online purchasing.
            </p>

            {/* Newsletter */}
            <div className="flex items-center gap-2 bg-beige-50 border border-primary-100 rounded-xl px-3 py-2.5">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent text-xs text-primary-700 placeholder-primary-300 outline-none"
                readOnly
              />
              <button className="flex-shrink-0 text-[10px] font-semibold text-accent-500 hover:text-accent-700 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-[9px] text-primary-300 mt-1.5 px-0.5">
              Weekly style updates. No spam.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-1">
              <h3 className="text-[10px] text-primary-400 uppercase tracking-widest font-semibold mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-primary-600 hover:text-primary-900 transition-colors leading-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-primary-300 uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Fitwear Studio. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-700 uppercase tracking-wider font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
                <ExternalLink size={9} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
