import { ArrowRight, Edit3, Eye, Shirt } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { DESIGN_STATUS, getDesignStatusTone } from "../../shared/constants/designStatus";
import { formatDate } from "../../shared/utils/formatDate";
import DesignPreview from "./DesignPreview";
import { useMyDesignsQuery } from "./api";

export default function MyDesignsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const designsQuery = useMyDesignsQuery({ page, pageSize });
  const data = designsQuery.data?.data;

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent-600">Customer Studio</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">My saved designs</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
              Continue editing drafts, request AI Try-On for saved designs, or send a print-ready design to checkout.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => window.location.assign("/products")}>
            <Shirt size={16} />
            Start from product
          </Button>
        </div>

        {designsQuery.isLoading && <Loading label="Loading your designs..." />}
        {designsQuery.isError && <ErrorState description="Could not load your designs. Please login again or retry later." />}
        {data && data.items.length === 0 && (
          <EmptyState title="No designs yet" description="Choose a product, select a variant, and start your first design draft." />
        )}

        {data && data.items.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((design) => {
                const isLocked = design.status === DESIGN_STATUS.locked;
                const isSaved = design.status === DESIGN_STATUS.saved;

                return (
                  <article key={design.id} className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft">
                    <DesignPreview imageUrl={design.previewImageUrl} name={design.name} className="rounded-none" />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold text-primary-950">{design.name}</h2>
                          <p className="mt-1 text-xs text-primary-400">{formatDate(design.createdAt)}</p>
                        </div>
                        <Badge tone={getDesignStatusTone(design.status)}>{design.status}</Badge>
                      </div>

                      <div className="mt-5 grid gap-2 sm:grid-cols-3">
                        <Link
                          to={`/designs/${design.id}/editor`}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-200 px-3 py-2 text-xs font-semibold text-primary-800 transition hover:border-primary-900"
                        >
                          {isLocked ? <Eye size={14} /> : <Edit3 size={14} />}
                          {isLocked ? "View" : "Edit"}
                        </Link>
                        <Link
                          to={`/tryon/${design.id}`}
                          className={[
                            "inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition",
                            isSaved || isLocked
                              ? "border border-accent-200 text-accent-700 hover:border-accent-500"
                              : "pointer-events-none border border-primary-100 text-primary-300",
                          ].join(" ")}
                        >
                          Try-On
                        </Link>
                        <Link
                          to={`/checkout/${design.id}`}
                          className={[
                            "inline-flex items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition",
                            isSaved
                              ? "bg-primary-900 text-white hover:bg-primary-700"
                              : "pointer-events-none bg-primary-100 text-primary-300",
                          ].join(" ")}
                        >
                          Checkout
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-soft">
              <p className="text-sm text-primary-500">
                Page {data.page} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
