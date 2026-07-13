import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  apiRequest,
  getApiErrorMessage,
  publicHttpClient,
} from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type {
  CreateDraftDesignRequest,
  CreateDraftDesignResponse,
  ProductDetail,
  ProductListItem,
  ProductListParams,
  ProductListResponse,
  ProductVariant,
} from "./types";

const DEFAULT_PRODUCT_PARAMS = {
  status: "ACTIVE",
  page: 1,
  pageSize: 12,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function unwrapApiData(value: unknown) {
  if (isRecord(value) && "data" in value) {
    return value.data;
  }

  return value;
}

function normalizeProductListItem(value: unknown): ProductListItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const name = readString(value.name);

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    description: readString(value.description),
    basePrice: readNumber(value.basePrice),
    thumbnailUrl: readString(value.thumbnailUrl) || null,
    status: readString(value.status) || "ACTIVE",
  };
}

function normalizeProductImage(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const imageUrl = readString(value.imageUrl);

  if (!id || !imageUrl) {
    return null;
  }

  return {
    id,
    imageUrl,
    isThumbnail: Boolean(value.isThumbnail ?? value.thumbnail),
    sortOrder: readNumber(value.sortOrder),
  };
}

function normalizeProductVariant(value: unknown): ProductVariant | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const inventory = isRecord(value.inventory) ? value.inventory : null;

  if (!id) {
    return null;
  }

  return {
    id,
    sku: readString(value.sku),
    size: readString(value.size),
    color: readString(value.color),
    material: readString(value.material),
    priceAdjustment: readNumber(value.priceAdjustment),
    availableQuantity: readNumber(
      value.availableQuantity ?? inventory?.availableQuantity,
    ),
    status: readString(value.status) || "ACTIVE",
  };
}

function normalizeProductListResponse(
  value: unknown,
  requestedPage: number,
  requestedPageSize: number,
): ProductListResponse {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => normalizeProductListItem(item))
      .filter((item): item is ProductListItem => Boolean(item));

    return {
      items,
      page: requestedPage,
      pageSize: requestedPageSize,
      totalItems: items.length,
      totalPages: 1,
    };
  }

  const data = isRecord(value) ? value : {};
  const items = Array.isArray(data.items) ? data.items : [];

  return {
    items: items
      .map((item) => normalizeProductListItem(item))
      .filter((item): item is ProductListResponse["items"][number] => Boolean(item)),
    page: readNumber(data.page, DEFAULT_PRODUCT_PARAMS.page),
    pageSize: readNumber(data.pageSize, DEFAULT_PRODUCT_PARAMS.pageSize),
    totalItems: readNumber(data.totalItems),
    totalPages: Math.max(1, readNumber(data.totalPages, 1)),
  };
}

function normalizeProductDetail(value: unknown): ProductDetail | null {
  const summary = normalizeProductListItem(value);

  if (!summary || !isRecord(value)) {
    return null;
  }

  const images = Array.isArray(value.images) ? value.images : [];
  const variants = Array.isArray(value.variants) ? value.variants : [];

  return {
    ...summary,
    images: images
      .map((image) => normalizeProductImage(image))
      .filter((image): image is ProductDetail["images"][number] => Boolean(image))
      .sort((a, b) => a.sortOrder - b.sortOrder),
    variants: variants
      .map((variant) => normalizeProductVariant(variant))
      .filter((variant): variant is ProductVariant => Boolean(variant)),
  };
}

function getErrorCode(error: unknown) {
  if (!axios.isAxiosError(error) || !isRecord(error.response?.data)) {
    return "";
  }

  const errors = error.response.data.errors;
  const firstError = Array.isArray(errors) ? errors[0] : null;

  if (isRecord(firstError)) {
    return readString(firstError.code);
  }

  return "";
}

export function getProductErrorMessage(error: unknown) {
  const code = getErrorCode(error);

  if (code === "INVALID_PAGE") {
    return "Invalid page number.";
  }

  if (code === "INVALID_PAGE_SIZE") {
    return "Invalid page size.";
  }

  if (code === "PRODUCT_NOT_FOUND") {
    return "Product not found.";
  }

  if (code === "PRODUCT_NOT_AVAILABLE") {
    return "Product is not available.";
  }

  return getApiErrorMessage(error);
}

export async function getProducts(params: ProductListParams = {}) {
  const keyword = params.keyword?.trim();
  const page = params.page ?? DEFAULT_PRODUCT_PARAMS.page;
  const pageSize = params.pageSize ?? DEFAULT_PRODUCT_PARAMS.pageSize;
  const response = await publicHttpClient.request<unknown>({
    url: "/api/products",
    method: "GET",
    params: {
      status: params.status ?? DEFAULT_PRODUCT_PARAMS.status,
      page,
      pageSize,
      ...(keyword ? { keyword } : {}),
    },
  });

  return {
    success: true,
    message: "Success",
    data: normalizeProductListResponse(unwrapApiData(response.data), page, pageSize),
    errors: null,
    meta: {
      requestId: "public-products",
      timestamp: new Date().toISOString(),
    },
  } satisfies ApiResponse<ProductListResponse>;
}

export async function getProductDetail(productId: string) {
  const safeProductId = productId.trim();

  if (!safeProductId) {
    throw new Error("Product id is required");
  }

  const response = await publicHttpClient.request<unknown>({
    url: `/api/products/${safeProductId}`,
    method: "GET",
  });

  return {
    success: true,
    message: "Success",
    data: normalizeProductDetail(unwrapApiData(response.data)),
    errors: null,
    meta: {
      requestId: "public-product-detail",
      timestamp: new Date().toISOString(),
    },
  } satisfies ApiResponse<ProductDetail>;
}

export function createDraftDesign(payload: CreateDraftDesignRequest) {
  return apiRequest<CreateDraftDesignResponse>({
    url: "/designs",
    method: "POST",
    data: payload,
  });
}

export function useProductsQuery(params: ProductListParams) {
  return useQuery<ApiResponse<ProductListResponse>>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}

export function useProductDetailQuery(productId: string) {
  return useQuery<ApiResponse<ProductDetail>>({
    queryKey: ["product-detail", productId],
    queryFn: () => getProductDetail(productId),
    enabled: Boolean(productId),
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateDraftDesignMutation() {
  return useMutation({
    mutationFn: createDraftDesign,
  });
}
