import { Boxes, Eye, Plus } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/httpClient";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Container from "../../../shared/components/Container";
import EmptyState from "../../../shared/components/EmptyState";
import ErrorState from "../../../shared/components/ErrorState";
import Input from "../../../shared/components/Input";
import Loading from "../../../shared/components/Loading";
import Textarea from "../../../shared/components/Textarea";
import type { BadgeTone } from "../../../shared/types";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatDate } from "../../../shared/utils/formatDate";
import { useAdminCatalogDetailQuery, useAdminCatalogsQuery, useCreateAdminCatalogMutation } from "./api";
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
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent-600">Admin Catalog</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
              Catalog management
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
              Connected to Swagger endpoints: create catalog, list catalogs, and get catalog detail by id.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm text-primary-500 shadow-soft">
            <span className="font-semibold text-primary-950">{catalogs.length}</span> catalogs loaded
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
          <form className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-900 text-white">
                <Plus size={18} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-primary-950">Create catalog</h2>
                <p className="text-sm text-primary-500">POST /admin/catalogs/create</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <Input
                label="Name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Oversized tees"
              />
              <Textarea
                label="Description"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Catalog description"
              />
              <Input
                label="Base price"
                type="number"
                min={0}
                required
                value={basePrice}
                onChange={(event) => setBasePrice(event.target.value)}
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

          <div className="space-y-6">
            <section className="rounded-3xl border border-primary-100 bg-white shadow-soft">
              <div className="flex items-center justify-between border-b border-primary-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-primary-950">Catalog list</h2>
                  <p className="mt-1 text-sm text-primary-500">GET /admin/catalogs</p>
                </div>
                <Boxes className="text-accent-500" size={22} />
              </div>

              {catalogsQuery.isLoading && <Loading label="Loading catalogs..." />}
              {catalogsQuery.isError && (
                <div className="p-6">
                  <ErrorState description="Could not load catalogs from backend." />
                </div>
              )}
              {!catalogsQuery.isLoading && !catalogsQuery.isError && catalogs.length === 0 && (
                <div className="p-6">
                  <EmptyState title="No catalogs yet" description="Create the first catalog using the form on the left." />
                </div>
              )}

              {catalogs.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-beige-50 text-xs uppercase tracking-wider text-primary-400">
                      <tr>
                        <th className="px-5 py-4">Name</th>
                        <th className="px-5 py-4">Base price</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Updated</th>
                        <th className="px-5 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100">
                      {catalogs.map((catalog) => (
                        <tr key={catalog.id} className={selectedId === catalog.id ? "bg-accent-50/60" : ""}>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-primary-950">{catalog.name}</p>
                            <p className="mt-1 max-w-sm truncate text-xs text-primary-500">{catalog.description}</p>
                          </td>
                          <td className="px-5 py-4 font-semibold text-primary-900">
                            {formatCurrency(catalog.basePrice)}
                          </td>
                          <td className="px-5 py-4">
                            <Badge tone={getCatalogStatusTone(catalog.status)}>{catalog.status}</Badge>
                          </td>
                          <td className="px-5 py-4 text-primary-500">{formatDate(catalog.updatedAt)}</td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full border border-primary-200 px-4 py-2 text-xs font-semibold text-primary-800 transition hover:border-primary-900"
                              onClick={() => setSelectedId(catalog.id)}
                            >
                              <Eye size={14} />
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <CatalogDetailPanel catalog={selectedCatalog} loading={detailQuery.isLoading} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function CatalogDetailPanel({ catalog, loading }: { catalog: AdminCatalog | null; loading: boolean }) {
  return (
    <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-primary-950">Catalog detail</h2>
        <p className="mt-1 text-sm text-primary-500">GET /admin/catalogs/{"{id}"}</p>
      </div>

      {loading && <Loading label="Loading catalog detail..." />}
      {!loading && !catalog && (
        <div className="rounded-2xl bg-beige-50 p-5 text-sm text-primary-500">
          Select a catalog from the table to inspect the detail endpoint response.
        </div>
      )}
      {!loading && catalog && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-beige-50 p-4">
            <p className="text-xs text-primary-400">ID</p>
            <p className="mt-1 break-all text-sm font-semibold text-primary-950">{catalog.id}</p>
          </div>
          <div className="rounded-2xl bg-beige-50 p-4">
            <p className="text-xs text-primary-400">Status</p>
            <div className="mt-2">
              <Badge tone={getCatalogStatusTone(catalog.status)}>{catalog.status}</Badge>
            </div>
          </div>
          <div className="rounded-2xl bg-beige-50 p-4">
            <p className="text-xs text-primary-400">Name</p>
            <p className="mt-1 text-sm font-semibold text-primary-950">{catalog.name}</p>
          </div>
          <div className="rounded-2xl bg-beige-50 p-4">
            <p className="text-xs text-primary-400">Base price</p>
            <p className="mt-1 text-sm font-semibold text-primary-950">{formatCurrency(catalog.basePrice)}</p>
          </div>
          <div className="rounded-2xl bg-beige-50 p-4 md:col-span-2">
            <p className="text-xs text-primary-400">Description</p>
            <p className="mt-1 text-sm leading-6 text-primary-700">{catalog.description}</p>
          </div>
          <div className="rounded-2xl bg-beige-50 p-4">
            <p className="text-xs text-primary-400">Created</p>
            <p className="mt-1 text-sm font-semibold text-primary-950">{formatDate(catalog.createdAt)}</p>
          </div>
          <div className="rounded-2xl bg-beige-50 p-4">
            <p className="text-xs text-primary-400">Updated</p>
            <p className="mt-1 text-sm font-semibold text-primary-950">{formatDate(catalog.updatedAt)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
