import { Boxes, ClipboardList, MessageSquare, Shirt } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../shared/components/Container";

const ADMIN_LINKS = [
  {
    label: "Catalog Management",
    description: "Create catalogs and inspect data from Swagger catalog APIs.",
    href: "/admin/catalogs",
    icon: Boxes,
  },
  {
    label: "Staff Orders",
    description: "Review production queue and order details.",
    href: "/staff/orders",
    icon: ClipboardList,
  },
  {
    label: "Feedback Review",
    description: "Approve, hide, or reject feedback by ID.",
    href: "/staff/feedbacks",
    icon: MessageSquare,
  },
  {
    label: "Products",
    description: "Product management remains separate from catalog management.",
    href: "/products",
    icon: Shirt,
  },
];

export default function AdminDashboardPage() {
  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold text-accent-600">Admin hub</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
            MVP operations shortcuts
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
            Manage catalog data from the running backend, then continue to production and feedback operations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {ADMIN_LINKS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft transition hover:-translate-y-1"
              >
                <Icon className="text-accent-500" size={26} />
                <h2 className="mt-5 text-xl font-semibold text-primary-950">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-primary-500">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
