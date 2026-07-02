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
      { label: "Checkout", href: "/designs/my" },
      { label: "Try-On", href: "/designs/my" },
    ],
  },
  {
    title: "Operations",
    links: [
      { label: "Staff", href: "/staff" },
      { label: "Admin", href: "/admin" },
      { label: "Orders Queue", href: "/staff/orders" },
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
      <div className="mx-auto max-w-[1780px] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
          <div className="lg:max-w-sm">
            <Link to="/" className="group mb-7 flex w-fit items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-900 transition-transform group-hover:scale-110">
                <Scissors size={20} className="text-white" strokeWidth={2.2} />
              </span>

              <span className="font-display text-2xl font-semibold leading-none text-primary-900">
                Fitwear<span className="text-accent-400"> Studio</span>
              </span>
            </Link>

            <p className="mb-8 max-w-sm text-base leading-relaxed text-primary-500">
              AI T-shirt customization, saved design flow, virtual try-on
              preview, order, payment, and public feedback for the MVP demo.
            </p>

            <div className="flex max-w-sm items-center gap-3 rounded-2xl border border-primary-100 bg-beige-50 px-4 py-3.5">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent text-sm text-primary-700 outline-none placeholder:text-primary-300"
                readOnly
              />

              <button className="flex-shrink-0 whitespace-nowrap rounded-full bg-primary-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-700">
                Subscribe
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-14 sm:gap-20 lg:flex-nowrap lg:gap-24">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-primary-400">
                  {col.title}
                </h3>

                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-base leading-none text-primary-600 transition-colors hover:text-primary-950"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-100">
        <div className="mx-auto flex max-w-[1780px] flex-col items-center justify-between gap-5 px-6 py-7 sm:flex-row sm:px-10 lg:px-16">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-400">
            &copy; {new Date().getFullYear()} Fitwear Studio. All rights
            reserved.
          </p>

          <div className="flex items-center gap-7">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-500 transition-colors hover:text-primary-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
                <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
