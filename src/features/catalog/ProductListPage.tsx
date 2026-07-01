import { Search } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import ErrorState from "../../shared/components/ErrorState";
import Input from "../../shared/components/Input";
import Loading from "../../shared/components/Loading";
import { MOCK_PRODUCTS } from "./mockData";
import ProductCard from "./ProductCard";
import { useProductsQuery } from "./api";

const PAGE_SIZE = 12;

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const [draftKeyword, setDraftKeyword] = useState(keyword);
  const params = useMemo(() => ({ keyword, page, pageSize: PAGE_SIZE }), [keyword, page]);
  const productsQuery = useProductsQuery(params);

  const fallbackItems = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    const filtered = normalized
      ? MOCK_PRODUCTS.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(normalized))
      : MOCK_PRODUCTS;
    const start = (page - 1) * PAGE_SIZE;
    return {
      items: filtered.slice(start, start + PAGE_SIZE),
      page,
      pageSize: PAGE_SIZE,
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    };
  }, [keyword, page]);

  const data = productsQuery.data?.data ?? (productsQuery.isError ? fallbackItems : null);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (draftKeyword.trim()) {
      next.set("keyword", draftKeyword.trim());
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-primary-400">Product Catalog</p>
            <h1 className="font-display text-4xl font-semibold text-primary-950 sm:text-5xl">Choose a T-shirt to customize</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-primary-500">
              Browse active T-shirt products, inspect variants, and start a design draft when you are ready to personalize one.
            </p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 rounded-2xl border border-primary-100 bg-white p-2 shadow-soft">
            <Input
              aria-label="Search products"
              value={draftKeyword}
              onChange={(event) => setDraftKeyword(event.target.value)}
              placeholder="Search T-shirts"
              className="border-transparent focus:border-transparent focus:ring-0"
            />
            <button type="submit" className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-900 text-white transition hover:bg-primary-700" aria-label="Search">
              <Search size={17} />
            </button>
          </form>
        </div>

        {productsQuery.isLoading && <Loading label="Loading products..." />}

        {productsQuery.isError && data && (
          <div className="mb-6 rounded-2xl border border-warning-500/20 bg-warning-50 px-4 py-3 text-sm text-warning-700">
            API is offline, showing preview products until the backend gateway is available.
          </div>
        )}

        {data && data.items.length === 0 && (
          <EmptyState title="No products found" description="Try a different keyword or clear your search." />
        )}

        {data && data.items.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            <div className="mt-10 flex items-center justify-between rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-soft">
              <p className="text-sm text-primary-500">
                Page <span className="font-semibold text-primary-900">{data.page}</span> of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={data.page <= 1}
                  onClick={() => goToPage(data.page - 1)}
                  className="rounded-full border border-primary-200 px-4 py-2 text-sm font-medium text-primary-700 transition hover:border-primary-900 hover:text-primary-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={data.page >= data.totalPages}
                  onClick={() => goToPage(data.page + 1)}
                  className="rounded-full bg-primary-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {productsQuery.isError && !data && (
          <ErrorState title="Cannot load products" description="Please check the API gateway and try again." onRetry={() => productsQuery.refetch()} />
        )}
      </Container>
    </section>
  );
}

