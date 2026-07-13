import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiRequest, getApiErrorMessage } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type {
  CreateDraftDesignRequest,
  CreateDraftDesignResponse,
  DesignDetail,
  DesignLayer,
  MyDesignListItem,
  MyDesignsResponse,
  SaveDesignRequest,
  SaveDesignResponse,
} from "./types";

export interface MyDesignsParams {
  page: number;
  pageSize: number;
}

const DESIGN_ERROR_MESSAGES: Record<string, string> = {
  PRODUCT_NOT_FOUND: "Product not found.",
  VARIANT_NOT_FOUND: "Variant not found.",
  VARIANT_NOT_AVAILABLE: "This variant is not available.",
  DESIGN_NOT_FOUND: "Design not found.",
  DESIGN_ACCESS_DENIED: "You do not have access to this design.",
  DESIGN_LOCKED: "This design is locked.",
  INVALID_CANVAS_JSON: "Canvas data is invalid.",
  DESIGN_LAYER_LIMIT_EXCEEDED: "Too many design layers.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function readArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function mapApiResponse<T>(
  response: ApiResponse<unknown>,
  data: T | null,
): ApiResponse<T> {
  return {
    ...response,
    data,
  };
}

function normalizeDesignLayer(value: unknown, index: number): DesignLayer | null {
  if (!isRecord(value)) {
    return null;
  }

  const layerType = readString(value.layerType);

  if (!layerType) {
    return null;
  }

  return {
    layerType,
    content: readString(value.content) || null,
    imageUrl: readString(value.imageUrl) || null,
    positionX: readNumber(value.positionX),
    positionY: readNumber(value.positionY),
    width: readNumber(value.width),
    height: readNumber(value.height),
    rotation: readNumber(value.rotation),
    color: readString(value.color) || null,
    zIndex: readNumber(value.zIndex, index + 1),
  };
}

function normalizeCreateDraftDesignResponse(
  value: unknown,
): CreateDraftDesignResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const designId = readString(value.designId) || readString(value.id);

  if (!designId) {
    return null;
  }

  return {
    designId,
    status: readString(value.status, "DRAFT"),
  };
}

function normalizeSaveDesignResponse(value: unknown): SaveDesignResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const designId = readString(value.designId) || readString(value.id);

  if (!designId) {
    return null;
  }

  return {
    designId,
    status: readString(value.status, "SAVED"),
    previewImageUrl: readString(value.previewImageUrl) || null,
    printFileUrl: readString(value.printFileUrl) || null,
  };
}

function normalizeMyDesignListItem(value: unknown): MyDesignListItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id) || readString(value.designId);
  const name = readString(value.name);

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    productId: readString(value.productId),
    productVariantId: readString(value.productVariantId),
    previewImageUrl: readString(value.previewImageUrl) || null,
    status: readString(value.status, "DRAFT"),
    createdAt: readString(value.createdAt),
  };
}

function normalizeMyDesignsResponse(
  value: unknown,
  requestedPage: number,
  requestedPageSize: number,
): MyDesignsResponse {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => normalizeMyDesignListItem(item))
      .filter((item): item is MyDesignListItem => Boolean(item));

    return {
      items,
      page: requestedPage,
      pageSize: requestedPageSize,
      totalItems: items.length,
      totalPages: 1,
    };
  }

  const data = isRecord(value) ? value : {};
  const items = readArray(data.items)
    .map((item) => normalizeMyDesignListItem(item))
    .filter((item): item is MyDesignListItem => Boolean(item));

  return {
    items,
    page: readNumber(data.page, requestedPage),
    pageSize: readNumber(data.pageSize, requestedPageSize),
    totalItems: readNumber(data.totalItems, items.length),
    totalPages: Math.max(1, readNumber(data.totalPages, 1)),
  };
}

function normalizeDesignDetail(value: unknown): DesignDetail | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id) || readString(value.designId);
  const name = readString(value.name);

  if (!id || !name) {
    return null;
  }

  return {
    id,
    customerId: readString(value.customerId) || undefined,
    productId: readString(value.productId),
    productVariantId: readString(value.productVariantId),
    name,
    canvasJson: value.canvasJson ?? {},
    previewImageUrl: readString(value.previewImageUrl) || null,
    printFileUrl: readString(value.printFileUrl) || null,
    status: readString(value.status, "DRAFT"),
    layers: readArray(value.layers)
      .map((layer, index) => normalizeDesignLayer(layer, index))
      .filter((layer): layer is DesignLayer => Boolean(layer)),
  };
}

function getDesignErrorCode(error: unknown) {
  if (!axios.isAxiosError(error) || !isRecord(error.response?.data)) {
    return "";
  }

  const data = error.response.data;
  const errors = data.errors;

  if (Array.isArray(errors)) {
    const firstError = errors.find((item) => isRecord(item));
    return isRecord(firstError) ? readString(firstError.code) : "";
  }

  if (isRecord(errors)) {
    const firstValue = Object.values(errors)[0];
    if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
      return firstValue[0];
    }
  }

  return readString(data.code);
}

export function getDesignErrorMessage(error: unknown) {
  const code = getDesignErrorCode(error);
  return DESIGN_ERROR_MESSAGES[code] ?? getApiErrorMessage(error);
}

export async function createDraftDesign(payload: CreateDraftDesignRequest) {
  const response = await apiRequest<unknown>({
    url: "/api/designs",
    method: "POST",
    data: payload,
  });

  return mapApiResponse(response, normalizeCreateDraftDesignResponse(response.data));
}

export async function getMyDesigns(params: MyDesignsParams) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const response = await apiRequest<unknown>({
    url: "/api/designs/my",
    method: "GET",
    params: {
      page,
      pageSize,
    },
  });

  return mapApiResponse(
    response,
    normalizeMyDesignsResponse(response.data, page, pageSize),
  );
}

export async function getDesignDetail(designId: string) {
  const safeDesignId = designId.trim();

  if (!safeDesignId) {
    throw new Error("Design id is required");
  }

  const response = await apiRequest<unknown>({
    url: `/api/designs/${safeDesignId}`,
    method: "GET",
  });

  return mapApiResponse(response, normalizeDesignDetail(response.data));
}

export async function saveDesign(
  designId: string,
  payload: SaveDesignRequest,
) {
  const safeDesignId = designId.trim();

  if (!safeDesignId) {
    throw new Error("Design id is required");
  }

  const response = await apiRequest<unknown>({
    url: `/api/designs/${safeDesignId}/save`,
    method: "PUT",
    data: payload,
  });

  return mapApiResponse(response, normalizeSaveDesignResponse(response.data));
}

export function useCreateDraftDesignMutation() {
  return useMutation({
    mutationFn: createDraftDesign,
  });
}

export function useMyDesignsQuery(params: MyDesignsParams) {
  return useQuery<ApiResponse<MyDesignsResponse>>({
    queryKey: ["designs", "my", params.page, params.pageSize],
    queryFn: () => getMyDesigns(params),
  });
}

export function useDesignDetailQuery(designId: string) {
  return useQuery<ApiResponse<DesignDetail>>({
    queryKey: ["designs", designId],
    queryFn: () => getDesignDetail(designId),
    enabled: Boolean(designId),
  });
}

export function useSaveDesignMutation(designId: string) {
  return useMutation({
    mutationFn: (payload: SaveDesignRequest) => saveDesign(designId, payload),
  });
}
