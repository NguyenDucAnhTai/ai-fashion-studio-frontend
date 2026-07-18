import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { useAuthStore } from "../auth/authStore";
import {
  getDesignErrorMessage,
  useCreateDraftDesignMutation,
} from "../design/api";
import {
  getProductErrorMessage,
  useProductDetailQuery,
  useProductsQuery,
} from "./api";
import ProductVisual from "./ProductVisual";
import type {
  ProductDetail,
  ProductImage,
  ProductSummary,
  ProductVariant,
} from "./types";

const PRODUCT_LIST_PARAMS = {
  status: "ACTIVE",
  page: 1,
  pageSize: 50,
};
const EMPTY_PRODUCTS: ProductSummary[] = [];

function isVariantAvailable(variant: ProductVariant) {
  return (
    variant.availableQuantity > 0 && variant.status.toUpperCase() === "ACTIVE"
  );
}

function buildGalleryImages(product: ProductDetail | null) {
  if (!product) {
    return [];
  }

  const thumbnail = product.thumbnailUrl
    ? [
        {
          id: `${product.id}-thumbnail`,
          imageUrl: product.thumbnailUrl,
          isThumbnail: true,
          sortOrder: -1,
        } satisfies ProductImage,
      ]
    : [];
  const seenUrls = new Set<string>();

  return [...thumbnail, ...product.images]
    .filter((image) => {
      if (!image.imageUrl || seenUrls.has(image.imageUrl)) {
        return false;
      }

      seenUrls.add(image.imageUrl);
      return true;
    })
    .sort((first, second) => {
      if (first.isThumbnail !== second.isThumbnail) {
        return first.isThumbnail ? -1 : 1;
      }

      return first.sortOrder - second.sortOrder;
    });
}

function getStatusBadgeClass(status: string) {
  if (status.toUpperCase() === "ACTIVE") {
    return "bg-success-50 text-success-700";
  }

  return "bg-primary-900 text-white";
}

function getVariantStockBadge(variant: ProductVariant) {
  if (variant.status.toUpperCase() !== "ACTIVE") {
    return {
      label: variant.status,
      className: "bg-primary-100 text-primary-700",
    };
  }

  if (variant.availableQuantity > 0) {
    return {
      label: `${variant.availableQuantity} left`,
      className: "bg-success-50 text-success-700",
    };
  }

  return {
    label: "Out of stock",
    className: "bg-error-50 text-error-700",
  };
}

function ProductDetailSkeleton() {
  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-11 w-40 animate-pulse rounded-full bg-primary-100" />
          <div className="flex gap-2">
            <div className="h-11 w-32 animate-pulse rounded-full bg-primary-100" />
            <div className="h-11 w-28 animate-pulse rounded-full bg-primary-100" />
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-start">
          <div className="space-y-4">
            <div className="h-[360px] animate-pulse rounded-3xl bg-primary-100 sm:h-[460px] lg:h-[560px]" />
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 w-20 animate-pulse rounded-2xl bg-primary-100 sm:h-24 sm:w-24"
                />
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
            <div className="h-3 w-32 animate-pulse rounded-full bg-primary-100" />
            <div className="mt-5 h-10 w-4/5 animate-pulse rounded-full bg-primary-100" />
            <div className="mt-5 space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-primary-100" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-primary-100" />
            </div>
            <div className="mt-7 h-28 animate-pulse rounded-3xl bg-primary-100" />
            <div className="mt-7 space-y-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl bg-primary-100"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function ProductDetailPage() {
  const { productId = "" } = useParams();
  const safeProductId = productId.trim();
  const navigate = useNavigate();
  const productQuery = useProductDetailQuery(safeProductId);
  const productsQuery = useProductsQuery(PRODUCT_LIST_PARAMS);
  const createDraft = useCreateDraftDesignMutation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const product = productQuery.data?.data ?? null;
  const products = productsQuery.data?.data?.items ?? EMPTY_PRODUCTS;
  const variants = useMemo(() => product?.variants ?? [], [product]);
  const galleryImages = useMemo(() => buildGalleryImages(product), [product]);
  const [selectedVariantState, setSelectedVariantState] = useState({
    productId: "",
    variantId: "",
  });
  const [selectedImageState, setSelectedImageState] = useState({
    productId: "",
    imageUrl: "",
  });
  const [buyError, setBuyError] = useState("");
  const [designValidationError, setDesignValidationError] = useState("");
  const defaultVariant =
    variants.find((variant) => isVariantAvailable(variant)) ??
    variants[0] ??
    null;
  const selectedVariantId =
    selectedVariantState.productId === product?.id
      ? selectedVariantState.variantId
      : (defaultVariant?.id ?? "");
  const selectedImageUrl =
    selectedImageState.productId === product?.id
      ? selectedImageState.imageUrl
      : (galleryImages[0]?.imageUrl ?? product?.thumbnailUrl ?? "");

  if (!safeProductId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Container>
          <ErrorState
            title="Product id is missing"
            description="Please return to the product catalog and choose a product."
          />
        </Container>
      </section>
    );
  }

  if (productQuery.isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (productQuery.isError) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Container>
          <div className="mb-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-soft transition hover:border-primary-900 hover:bg-primary-900 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to products
            </Link>
          </div>
          <ErrorState
            title="Cannot load product"
            description={getProductErrorMessage(productQuery.error)}
            onRetry={() => productQuery.refetch()}
          />
        </Container>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Container>
          <div className="mb-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-soft transition hover:border-primary-900 hover:bg-primary-900 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to products
            </Link>
          </div>
          <ErrorState
            title="Product not found"
            description="The product you are looking for is not available."
          />
        </Container>
      </section>
    );
  }

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    variants[0] ??
    null;
  const selectedVariantIsAvailable = selectedVariant
    ? isVariantAvailable(selectedVariant)
    : false;
  const finalPrice =
    product.basePrice + (selectedVariant?.priceAdjustment ?? 0);
  const currentIndex = products.findIndex((item) => item.id === product.id);
  const previousProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct =
    currentIndex >= 0 && currentIndex < products.length - 1
      ? products[currentIndex + 1]
      : null;
  const primaryImageUrl =
    selectedImageUrl ||
    galleryImages[0]?.imageUrl ||
    product.thumbnailUrl ||
    null;
  const canStartDesign = Boolean(selectedVariant && selectedVariantIsAvailable);

  const handleStartDesign = () => {
    setBuyError("");
    setDesignValidationError("");

    if (!product.id || !selectedVariant?.id) {
      setDesignValidationError("Missing product or variant information.");
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${product.id}`);
      return;
    }

    if (selectedVariant.status.toUpperCase() !== "ACTIVE") {
      setDesignValidationError("This variant is not available.");
      return;
    }

    if (selectedVariant.availableQuantity <= 0) {
      setDesignValidationError("This variant is not available.");
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
          const createdDesignId = response.data?.designId;

          if (createdDesignId) {
            navigate(`/designs/${createdDesignId}/editor`);
            return;
          }

          setDesignValidationError(
            "Design draft was created without a design id.",
          );
        },
      },
    );
  };

  const handleBuyNow = () => {
    setBuyError("");
    setDesignValidationError("");

    if (!product.id || !selectedVariant?.id) {
      setBuyError("Missing product or variant information.");
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${product.id}`);
      return;
    }

    if (selectedVariant.status.toUpperCase() !== "ACTIVE") {
      setBuyError("This variant is not available.");
      return;
    }

    if (selectedVariant.availableQuantity <= 0) {
      setBuyError("This variant is not available.");
      return;
    }

    navigate("/checkout", {
      state: {
        productId: product.id,
        productVariantId: selectedVariant.id,
      },
    });
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-primary-400"
        >
          <Link to="/" className="transition hover:text-primary-900">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="transition hover:text-primary-900">
            Products
          </Link>
          <span>/</span>
          <span className="max-w-[16rem] truncate text-primary-700 sm:max-w-md">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-start xl:gap-10">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-primary-100 bg-white p-3 shadow-[0_24px_80px_rgba(0,0,0,0.07)]">
              <div className="h-[360px] overflow-hidden rounded-[1.35rem] bg-beige-50 sm:h-[460px] lg:h-[560px]">
                <ProductVisual
                  imageUrl={primaryImageUrl}
                  name={product.name}
                  tone="light"
                />
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.length > 0 ? (
                galleryImages.map((image, index) => {
                  const isSelected = image.imageUrl === primaryImageUrl;

                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() =>
                        setSelectedImageState({
                          productId: product.id,
                          imageUrl: image.imageUrl,
                        })
                      }
                      aria-label={`Show product image ${index + 1}`}
                      className={[
                        "h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-white p-1 transition sm:h-24 sm:w-24",
                        isSelected
                          ? "border-primary-950 shadow-medium"
                          : "border-primary-100 hover:border-primary-400",
                      ].join(" ")}
                    >
                      <ProductVisual
                        imageUrl={image.imageUrl}
                        name={product.name}
                      />
                    </button>
                  );
                })
              ) : (
                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-primary-950 bg-white p-1 shadow-medium sm:h-24 sm:w-24">
                  <ProductVisual imageUrl={null} name={product.name} />
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-3xl border border-primary-100 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.07)] sm:p-8 lg:sticky lg:top-28">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-400">
                Product Detail
              </p>
              <span
                className={[
                  "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest",
                  getStatusBadgeClass(product.status),
                ].join(" ")}
              >
                {product.status}
              </span>
            </div>

            <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-primary-950 sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-primary-500">
              {product.description || "Ready for a custom print design."}
            </p>

            <div className="mt-7 rounded-3xl bg-beige-50 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-400">
                    Price
                  </p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-primary-950">
                    {formatCurrency(finalPrice)}
                  </p>
                </div>
                <p className="text-right text-xs leading-5 text-primary-500">
                  Base price
                  <span className="block font-semibold tabular-nums text-primary-900">
                    {formatCurrency(product.basePrice)}
                  </span>
                </p>
              </div>
              {selectedVariant && selectedVariant.priceAdjustment !== 0 && (
                <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-primary-600">
                  Variant adjustment:{" "}
                  <span className="font-semibold tabular-nums text-primary-950">
                    {formatCurrency(selectedVariant.priceAdjustment)}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-primary-950">
                  Select size, color, and material
                </h2>
                <span className="text-xs text-primary-400">
                  {variants.length} variant{variants.length === 1 ? "" : "s"}
                </span>
              </div>

              {variants.length > 0 ? (
                <div className="space-y-3">
                  {variants.map((variant) => {
                    const active = selectedVariant?.id === variant.id;
                    const available = isVariantAvailable(variant);
                    const stockBadge = getVariantStockBadge(variant);

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={!available}
                        onClick={() =>
                          setSelectedVariantState({
                            productId: product.id,
                            variantId: variant.id,
                          })
                        }
                        className={[
                          "grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border p-4 text-left transition",
                          active
                            ? "border-primary-950 bg-primary-50 shadow-soft"
                            : "border-primary-100 bg-white hover:border-primary-300",
                          !available
                            ? "cursor-not-allowed opacity-55 hover:border-primary-100"
                            : "",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold",
                            active
                              ? "bg-primary-950 text-white"
                              : "bg-beige-100 text-primary-700",
                          ].join(" ")}
                        >
                          {active ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            variant.size || "-"
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-primary-950">
                              {variant.color || "Default color"} /{" "}
                              {variant.size || "One size"}
                            </span>
                            <span
                              className={[
                                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                                stockBadge.className,
                              ].join(" ")}
                            >
                              {stockBadge.label}
                            </span>
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-primary-400">
                            {variant.material || "Standard cotton"} -{" "}
                            {variant.sku || "No SKU"}
                          </span>
                          {variant.priceAdjustment !== 0 && (
                            <span className="mt-2 block text-xs font-semibold tabular-nums text-primary-700">
                              + {formatCurrency(variant.priceAdjustment)}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-primary-200 bg-beige-50 px-4 py-5 text-sm text-primary-500">
                  No variants are available for this product yet.
                </div>
              )}
            </div>

            {(designValidationError || createDraft.isError) && (
              <p className="mt-5 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {designValidationError ||
                  getDesignErrorMessage(createDraft.error)}
              </p>
            )}

            <Button
              type="button"
              variant="custom"
              size="lg"
              className="mt-7 w-full bg-primary-950 text-white shadow-soft hover:bg-primary-700 active:scale-[0.99]"
              loading={createDraft.isPending}
              disabled={!canStartDesign || createDraft.isPending}
              onClick={handleStartDesign}
            >
              {createDraft.isPending ? "Creating design..." : "Start Design"}
              <ArrowRight size={17} />
            </Button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!canStartDesign}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-200 bg-white px-8 py-3.5 text-base font-medium text-primary-900 transition hover:border-primary-950 hover:bg-primary-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-primary-200 disabled:hover:bg-white disabled:hover:text-primary-900"
            >
              <ShoppingBag size={17} />
              Mua hàng
            </button>

            {buyError && (
              <p className="mt-4 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {buyError}
              </p>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary-100 bg-beige-50 p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 flex-shrink-0 text-primary-800"
              />
              <p className="text-xs leading-6 text-primary-500">
                Saved designs create the print file. AI Try-On images are only
                used as previews.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-primary-100 bg-white p-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:border-primary-900 hover:bg-primary-900 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!previousProduct}
              onClick={() => {
                if (previousProduct) {
                  navigate(`/products/${previousProduct.id}`);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:border-primary-900 hover:bg-primary-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-primary-100 disabled:hover:bg-white disabled:hover:text-primary-800"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              disabled={!nextProduct}
              onClick={() => {
                if (nextProduct) {
                  navigate(`/products/${nextProduct.id}`);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:border-primary-900 hover:bg-primary-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-primary-100 disabled:hover:bg-white disabled:hover:text-primary-800"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
