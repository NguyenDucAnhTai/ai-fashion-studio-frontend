import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import { getProductErrorMessage, useProductsQuery } from "./api";
import ProductCard from "./ProductCard";
import type { ProductSummary } from "./types";
import ErrorState from "../../shared/components/ErrorState";

const PAGE_SIZE = 12;
const EMPTY_PRODUCTS: ProductSummary[] = [];
const SKELETON_CARDS = Array.from({ length: 8 }, (_, index) => index);

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-[0_16px_50px_rgba(0,0,0,0.05)]">
      <div className="aspect-[4/5] animate-pulse bg-primary-100" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-primary-100" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-primary-100" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-primary-100" />
        </div>
        <div className="flex items-center justify-between border-t border-primary-100 pt-5">
          <div className="h-5 w-24 animate-pulse rounded-full bg-primary-100" />
          <div className="h-9 w-20 animate-pulse rounded-full bg-primary-100" />
        </div>
      </div>
    </div>
  );
}

export default function ProductListPage() {
  const [draftKeyword, setDraftKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [page, setPage] = useState(1);
  const productParams = useMemo(
    () => ({
      status: "ACTIVE",
      page: 1,
      pageSize: PAGE_SIZE,
    }),
    [],
  );
  const productsQuery = useProductsQuery(productParams);
  const allItems = productsQuery.data?.data?.items ?? EMPTY_PRODUCTS;

  const filteredItems = useMemo(() => {
    const keyword = appliedKeyword.trim().toLowerCase();

    if (!keyword) {
      return allItems;
    }

    return allItems.filter((product) =>
      [
        product.name,
        product.description,
        product.status,
        String(product.basePrice),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [allItems, appliedKeyword]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleItems = filteredItems.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedKeyword(draftKeyword.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setDraftKeyword("");
    setAppliedKeyword("");
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-10 rounded-[2rem] border border-primary-100 bg-white px-5 py-6 shadow-[0_20px_70px_rgba(0,0,0,0.05)] sm:px-8 lg:px-10 lg:py-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-primary-400">
                Product Catalog
              </p>
              <h1 className="max-w-3xl text-balance font-display text-4xl font-semibold text-primary-950 sm:text-5xl">
                Choose a T-shirt to customize
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-500 sm:text-base">
                Browse active T-shirt products, compare base prices, and open
                the design flow when you are ready to personalize.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="rounded-3xl border border-primary-100 bg-beige-50 p-2 shadow-inner"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Search products</span>
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
                  />
                  <input
                    value={draftKeyword}
                    onChange={(event) => setDraftKeyword(event.target.value)}
                    placeholder="Search products"
                    className="h-12 w-full rounded-2xl border border-transparent bg-white pl-11 pr-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-primary-900 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <div className="flex gap-2">
                  {appliedKeyword && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear search"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-100 bg-white text-primary-500 transition hover:border-primary-900 hover:text-primary-900"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary-950 px-5 text-sm font-semibold text-white transition hover:bg-primary-700 active:scale-[0.98]"
                  >
                    <Search size={16} />
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {productsQuery.isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SKELETON_CARDS.map((item) => (
              <ProductCardSkeleton key={item} />
            ))}
          </div>
        )}

        {productsQuery.isError && (
          <ErrorState
            title="Cannot load products"
            description={getProductErrorMessage(productsQuery.error)}
            onRetry={() => productsQuery.refetch()}
          />
        )}

        {!productsQuery.isLoading &&
          !productsQuery.isError &&
          filteredItems.length === 0 && (
            <EmptyState
              title="No products found"
              description={
                appliedKeyword
                  ? "No products match your search. Clear it to see the active catalog again."
                  : "No active products are available yet."
              }
            />
          )}

        {!productsQuery.isError && visibleItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 rounded-3xl border border-primary-100 bg-white px-5 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-primary-500">
                Showing{" "}
                <span className="font-semibold text-primary-950">
                  {(safePage - 1) * PAGE_SIZE + 1}
                </span>
                {" - "}
                <span className="font-semibold text-primary-950">
                  {(safePage - 1) * PAGE_SIZE + visibleItems.length}
                </span>{" "}
                of {filteredItems.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition hover:border-primary-900 hover:bg-primary-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={15} />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
