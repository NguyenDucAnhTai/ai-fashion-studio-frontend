import { ExternalLink, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Browse",
    links: [
      { label: "Landing", href: "/" },
      { label: "Products", href: "/products" },
      { label: "About Us", href: "/about-us" },
      { label: "Public Feedback", href: "/feedbacks" },
    ],
  },
  {
    title: "Customer Flow",
    links: [
      { label: "My Designs", href: "/designs/my" },
      { label: "My Orders", href: "/orders/my" },
      { label: "Payment", href: "/payment/success" },
      { label: "Try-On", href: "/products" },
    ],
  },
  {
    title: "Operations",
    links: [
      { label: "Staff", href: "/staff" },
      { label: "Admin", href: "/admin" },
      { label: "Inventory", href: "/admin/inventory" },
      { label: "Feedback Review", href: "/staff/feedbacks" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Orders", href: "/orders/my" },
      { label: "Saved Designs", href: "/designs/my" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "X", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-primary-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="group mb-5 flex w-fit items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-900 transition-transform group-hover:scale-110">
                <Scissors size={15} className="text-white" strokeWidth={2} />
              </span>
              <span className="font-display text-lg font-semibold leading-none text-primary-900">
                Fitwear<span className="text-accent-400"> Studio</span>
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-relaxed text-primary-500">
              AI T-shirt customization, saved design flow, virtual try-on preview, order, payment, and public feedback for the MVP demo.
            </p>

            <div className="flex items-center gap-2 rounded-xl border border-primary-100 bg-beige-50 px-3 py-2.5">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent text-xs text-primary-700 outline-none placeholder:text-primary-300"
                readOnly
              />
              <button className="flex-shrink-0 whitespace-nowrap text-[10px] font-semibold text-accent-500 transition-colors hover:text-accent-700">
                Subscribe
              </button>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-1">
              <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-primary-400">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm leading-none text-primary-600 transition-colors hover:text-primary-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-primary-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-wider text-primary-300">
            &copy; {new Date().getFullYear()} Fitwear Studio. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-primary-400 transition-colors hover:text-primary-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
                <ExternalLink size={9} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
