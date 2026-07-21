import {
  ArrowRight,
  Boxes,
  ClipboardList,
  Layers3,
  MessageSquare,
  PackageSearch,
  Shirt,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminCatalogsQuery } from "./catalog/api";

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
    label: "Storefront Products",
    description: "Preview the customer catalog without entering the public navbar flow.",
    href: "/products",
    icon: PackageSearch,
  },
];

export default function AdminDashboardPage() {
  const catalogsQuery = useAdminCatalogsQuery();
  const catalogs = catalogsQuery.data?.data ?? [];
  const activeCatalogs = catalogs.filter((catalog) => catalog.status === "ACTIVE").length;
  const draftCatalogs = catalogs.filter((catalog) => catalog.status === "DRAFT").length;

  const stats = [
    {
      label: "Catalogs",
      value: catalogsQuery.isLoading ? "Loading" : catalogsQuery.isError ? "Unavailable" : String(catalogs.length),
      caption: catalogsQuery.isError ? "Catalog API needs attention" : `${activeCatalogs} active catalogs`,
      icon: Boxes,
    },
    {
      label: "Products",
      value: "Storefront",
      caption: "Customer product catalog",
      icon: Shirt,
    },
    {
      label: "Orders",
      value: "Staff queue",
      caption: "Production handoff",
      icon: ClipboardList,
    },
    {
      label: "Feedback",
      value: "Review",
      caption: "Moderation workspace",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-xl bg-primary-950 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <Sparkles size={14} />
              Admin Overview
            </span>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Operations Dashboard
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Monitor catalog, orders, inventory, and feedback from one workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Today overview
            </p>
            <div className="mt-5 space-y-4">
              <OverviewRow label="Pending orders" value="Open staff queue" />
              <OverviewRow
                label="Active catalogs"
                value={catalogsQuery.isLoading ? "Loading" : catalogsQuery.isError ? "Unavailable" : String(activeCatalogs)}
              />
              <OverviewRow label="Feedback awaiting review" value="Review workspace" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {item.value}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-primary-900">
                  <Icon size={20} />
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500">{item.caption}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent-700">Quick actions</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Keep the demo moving
              </h3>
            </div>
            <Link
              to="/admin/catalogs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900 transition hover:text-accent-700"
            >
              Open catalogs
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {ADMIN_LINKS.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary-900 shadow-sm transition group-hover:bg-primary-950 group-hover:text-white">
                    <Icon size={19} />
                  </span>
                  <h4 className="mt-5 text-base font-semibold text-slate-950">{item.label}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-primary-950 p-6 text-white shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Layers3 size={22} />
          </div>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight">Catalog signal</h3>
          <p className="mt-3 text-sm leading-7 text-white/62">
            The dashboard reads catalog availability from the existing admin catalog query. Order and feedback cards link to their current operational workspaces.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <MiniMetric label="Draft" value={catalogsQuery.isError ? "-" : String(draftCatalogs)} />
            <MiniMetric label="Active" value={catalogsQuery.isError ? "-" : String(activeCatalogs)} />
          </div>
        </aside>
      </section>
    </div>
  );
}

function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
