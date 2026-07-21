import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Boxes,
  Eye,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/httpClient";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import EmptyState from "../../../shared/components/EmptyState";
import ErrorState from "../../../shared/components/ErrorState";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Textarea from "../../../shared/components/Textarea";
import type { BadgeTone } from "../../../shared/types";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatDate } from "../../../shared/utils/formatDate";
import {
  useAdminCatalogDetailQuery,
  useAdminCatalogsQuery,
  useCreateAdminCatalogMutation,
} from "./api";
import type { AdminCatalog } from "./types";

function getCatalogStatusTone(status: string): BadgeTone {
  if (status === "ACTIVE") {
    return "success";
  }

  if (status === "DRAFT") {
    return "warning";
  }

  if (status === "INACTIVE") {
    return "error";
  }

  return "neutral";
}

type SortKey = "name" | "basePrice" | "updatedAt";
type SortDir = "asc" | "desc";

export default function CatalogManagementPage() {
  const catalogsQuery = useAdminCatalogsQuery();
  const createCatalog = useCreateAdminCatalogMutation();
  const catalogs = useMemo(() => catalogsQuery.data?.data ?? [], [catalogsQuery.data?.data]);
  const [selectedId, setSelectedId] = useState("");
  const selectedCatalogFallback = catalogs.find((catalog) => catalog.id === selectedId) ?? null;
  const detailQuery = useAdminCatalogDetailQuery(selectedId);
  const selectedCatalog = detailQuery.data?.data ?? selectedCatalogFallback;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("0");

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const statusOptions = useMemo(
    () => Array.from(new Set(catalogs.map((catalog) => catalog.status))).sort(),
    [catalogs],
  );

  const visibleCatalogs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const filtered = catalogs.filter((catalog) => {
      const matchesKeyword = normalizedKeyword
        ? catalog.name.toLowerCase().includes(normalizedKeyword)
        : true;
      const matchesStatus = statusFilter === "ALL" ? true : catalog.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });

    if (!sortKey) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      let comparison: number;

      if (sortKey === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortKey === "basePrice") {
        comparison = a.basePrice - b.basePrice;
      } else {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }

      return sortDir === "asc" ? comparison : -comparison;
    });
  }, [catalogs, keyword, statusFilter, sortKey, sortDir]);

  const activeCatalogs = catalogs.filter((catalog) => catalog.status === "ACTIVE").length;
  const hasActiveFilters = Boolean(keyword) || statusFilter !== "ALL";
  const detailErrorMessage = detailQuery.isError ? getApiErrorMessage(detailQuery.error) : "";

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const clearFilters = () => {
    setKeyword("");
    setStatusFilter("ALL");
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={13} className="text-slate-300" />;
    }

    return sortDir === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setBasePrice("0");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createCatalog.mutate(
      {
        name,
        description,
        basePrice: Number(basePrice),
      },
      {
        onSuccess: (response) => {
          resetForm();
          if (response.data?.id) {
            setSelectedId(response.data.id);
          }
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm ring-1 ring-slate-200">
            <Boxes size={14} />
            Admin Catalog
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Catalog Management
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
            Create and manage product catalogs from backend APIs.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SummaryCard label="Catalogs loaded" value={catalogsQuery.isLoading ? "Loading" : String(catalogs.length)} />
          <SummaryCard label="Active catalogs" value={catalogsQuery.isError ? "-" : String(activeCatalogs)} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <form
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-28 xl:self-start"
          onSubmit={handleSubmit}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-950 text-white">
              <Plus size={18} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Create catalog</h3>
              <span className="mt-2 inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                POST /admin/catalogs/create
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Input
              label="Name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Oversized tees"
              className="border-slate-200 focus:border-primary-500 focus:ring-primary-100"
            />
            <Textarea
              label="Description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Catalog description"
              className="border-slate-200 focus:border-primary-500 focus:ring-primary-100"
            />
            <Input
              label="Base price"
              type="number"
              min={0}
              required
              value={basePrice}
              onChange={(event) => setBasePrice(event.target.value)}
              className="border-slate-200 focus:border-primary-500 focus:ring-primary-100"
            />
          </div>

          {createCatalog.isError && (
            <p className="mt-5 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
              {getApiErrorMessage(createCatalog.error)}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-6 w-full" loading={createCatalog.isPending}>
            <Plus size={17} />
            Create catalog
          </Button>
        </form>

        <div className="min-w-0 space-y-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Catalog list</h3>
                <p className="mt-1 text-sm text-slate-500">GET /admin/catalogs</p>
              </div>
              <button
                type="button"
                onClick={() => void catalogsQuery.refetch()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={catalogsQuery.isFetching}
              >
                <RefreshCw size={16} className={catalogsQuery.isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            <div className="grid gap-3 border-b border-slate-200 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_190px_auto] lg:items-center">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Search catalog name"
                  aria-label="Search catalogs by name"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <Select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="border-slate-200 bg-slate-50 focus:border-primary-500 focus:ring-primary-100"
              >
                <option value="ALL">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>

            {catalogsQuery.isLoading && <CatalogTableSkeleton />}
            {catalogsQuery.isError && (
              <div className="p-5">
                <ErrorState
                  title="Cannot load catalogs"
                  description={getApiErrorMessage(catalogsQuery.error)}
                  onRetry={() => void catalogsQuery.refetch()}
                />
              </div>
            )}
            {!catalogsQuery.isLoading && !catalogsQuery.isError && catalogs.length === 0 && (
              <div className="p-5">
                <EmptyState title="No catalogs yet" description="Create the first catalog using the form on the left." />
              </div>
            )}
            {!catalogsQuery.isLoading && !catalogsQuery.isError && catalogs.length > 0 && visibleCatalogs.length === 0 && (
              <div className="p-5">
                <EmptyState title="No catalogs match your filters" description="Try another keyword or status." />
              </div>
            )}

            {visibleCatalogs.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-400">
                    <tr>
                      <th className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => toggleSort("name")}
                          className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
                        >
                          Name {renderSortIcon("name")}
                        </button>
                      </th>
                      <th className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => toggleSort("basePrice")}
                          className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
                        >
                          Base price {renderSortIcon("basePrice")}
                        </button>
                      </th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => toggleSort("updatedAt")}
                          className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
                        >
                          Updated {renderSortIcon("updatedAt")}
                        </button>
                      </th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleCatalogs.map((catalog) => (
                      <tr
                        key={catalog.id}
                        className={[
                          "transition hover:bg-slate-50",
                          selectedId === catalog.id ? "bg-accent-50/70" : "",
                        ].join(" ")}
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-950">{catalog.name}</p>
                          <p className="mt-1 max-w-sm truncate text-xs text-slate-500">{catalog.description}</p>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          {formatCurrency(catalog.basePrice)}
                        </td>
                        <td className="px-5 py-4">
                          <Badge tone={getCatalogStatusTone(catalog.status)}>{catalog.status}</Badge>
                        </td>
                        <td className="px-5 py-4 text-slate-500">{formatDate(catalog.updatedAt)}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-900 hover:text-primary-900"
                            onClick={() => setSelectedId(catalog.id)}
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <CatalogDetailPanel
            catalog={selectedCatalog}
            loading={detailQuery.isLoading}
            errorMessage={detailErrorMessage}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function CatalogTableSkeleton() {
  return (
    <div className="space-y-3 p-5" aria-label="Loading catalogs">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="grid gap-4 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1.4fr_1fr_0.7fr_1fr]">
          <span className="h-4 animate-pulse rounded-full bg-slate-200" />
          <span className="h-4 animate-pulse rounded-full bg-slate-200" />
          <span className="h-4 animate-pulse rounded-full bg-slate-200" />
          <span className="h-4 animate-pulse rounded-full bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function CatalogDetailPanel({
  catalog,
  loading,
  errorMessage,
}: {
  catalog: AdminCatalog | null;
  loading: boolean;
  errorMessage: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Catalog detail</h3>
          <p className="mt-1 text-sm text-slate-500">GET /admin/catalogs/{"{id}"}</p>
        </div>
        {catalog && <Badge tone={getCatalogStatusTone(catalog.status)}>{catalog.status}</Badge>}
      </div>

      {loading && (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      )}

      {!loading && errorMessage && (
        <p className="mt-5 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
          {errorMessage}
        </p>
      )}

      {!loading && !catalog && !errorMessage && (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          Select a catalog from the table to inspect the detail endpoint response.
        </div>
      )}

      {!loading && catalog && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <DetailCell label="ID" value={catalog.id} muted />
          <DetailCell label="Name" value={catalog.name} />
          <DetailCell label="Base price" value={formatCurrency(catalog.basePrice)} />
          <DetailCell label="Created" value={formatDate(catalog.createdAt)} />
          <DetailCell label="Updated" value={formatDate(catalog.updatedAt)} />
          <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Description
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{catalog.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function DetailCell({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className={["mt-2 break-all text-sm font-semibold", muted ? "text-slate-600" : "text-slate-950"].join(" ")}>
        {value}
      </p>
    </div>
  );
}
