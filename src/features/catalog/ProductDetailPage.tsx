import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import { useCreateDraftDesignMutation, useProductDetailQuery } from "./api";
import { findMockProduct } from "./mockData";
import ProductVisual from "./ProductVisual";

export default function ProductDetailPage() {
  const { productId = "" } = useParams();
  const navigate = useNavigate();
  const productQuery = useProductDetailQuery(productId);
  const createDraft = useCreateDraftDesignMutation();
  const product = productQuery.data?.data ?? (productQuery.isError ? findMockProduct(productId) : null);
  const variants = useMemo(() => product?.variants ?? [], [product]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];

  if (productQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Loading label="Loading product detail..." />
      </section>
    );
  }

  if (!product) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Container>
          <ErrorState title="Product not found" description="The product you are looking for is not available." />
        </Container>
      </section>
    );
  }

  const totalPrice = product.basePrice + (selectedVariant?.priceAdjustment ?? 0);
  const canStartDesign = Boolean(selectedVariant && selectedVariant.availableQuantity > 0);

  const handleStartDesign = () => {
    if (!selectedVariant) {
      return;
    }

    if (!localStorage.getItem("accessToken")) {
      navigate(`/login?redirect=/products/${product.id}`);
      return;
    }

    createDraft.mutate(
      {
        productId: product.id,
        productVariantId: selectedVariant.id,
        name: `${product.name} Design`,
      },
      {
        onSuccess: (response) => {
          if (response.data?.designId) {
            navigate(`/designs/${response.data.designId}/editor`);
          }
        },
      },
    );
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        {productQuery.isError && (
          <div className="mb-6 rounded-2xl border border-warning-500/20 bg-warning-50 px-4 py-3 text-sm text-warning-700">
            API is offline, showing preview product detail until the backend gateway is available.
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft">
            <div className="h-[520px] overflow-hidden">
              <ProductVisual imageUrl={product.images.find((image) => image.isThumbnail)?.imageUrl ?? product.thumbnailUrl} name={product.name} tone="light" />
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-primary-100 p-3">
              {["Front print", "Variant fit", "Print file"].map((label, index) => (
                <div key={label} className="rounded-2xl bg-beige-50 px-3 py-4 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-400">0{index + 1}</p>
                  <p className="mt-1 text-xs font-semibold text-primary-800">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft lg:sticky lg:top-28">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-primary-400">Product Detail</p>
            <h1 className="font-display text-4xl font-semibold text-primary-950">{product.name}</h1>
            <p className="mt-4 text-base leading-8 text-primary-500">{product.description}</p>

            <div className="mt-6 flex items-end justify-between border-y border-primary-100 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-400">Price</p>
                <p className="mt-1 text-2xl font-semibold text-primary-950">{formatCurrency(totalPrice)}</p>
              </div>
              <span className="rounded-full bg-success-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-success-700">
                {product.status}
              </span>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-primary-900">Select size, color, and material</p>
              <div className="space-y-3">
                {variants.map((variant) => {
                  const active = selectedVariant?.id === variant.id;
                  const soldOut = variant.availableQuantity <= 0;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={[
                        "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition",
                        active ? "border-primary-900 bg-primary-50" : "border-primary-100 bg-white hover:border-primary-300",
                      ].join(" ")}
                    >
                      <span className={[
                        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl",
                        active ? "bg-primary-900 text-white" : "bg-beige-100 text-primary-500",
                      ].join(" ")}>
                        {active ? <CheckCircle2 size={16} /> : variant.size}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-primary-900">{variant.color} / {variant.size}</span>
                        <span className="mt-0.5 block text-xs text-primary-400">{variant.material} - {variant.sku}</span>
                      </span>
                      <span className={[
                        "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider",
                        soldOut ? "bg-error-50 text-error-700" : "bg-success-50 text-success-700",
                      ].join(" ")}
                      >
                        {soldOut ? "Out" : `${variant.availableQuantity} left`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {createDraft.isError && (
              <p className="mt-4 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getApiErrorMessage(createDraft.error)}
              </p>
            )}

            <Button
              type="button"
              size="lg"
              className="mt-7 w-full"
              loading={createDraft.isPending}
              disabled={!canStartDesign}
              onClick={handleStartDesign}
            >
              Start Design
              <ArrowRight size={16} />
            </Button>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-beige-50 p-4">
              <ShieldCheck size={18} className="mt-0.5 flex-shrink-0 text-accent-500" />
              <p className="text-xs leading-6 text-primary-500">
                Saved designs are used for print files. AI Try-On results are previews only, matching the MVP business rule.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
