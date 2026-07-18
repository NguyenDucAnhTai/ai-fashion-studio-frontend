import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiRequest, getApiErrorMessage } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  MyOrdersResponse,
  OrderDetail,
  OrderItem,
  OrderStatusHistoryItem,
  OrderSummary,
  OrderVariantSnapshot,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "./types";

export interface OrderListParams {
  page: number;
  pageSize: number;
}

export const MISSING_CUSTOMER_MESSAGE =
  "Missing customer information. Please login again.";

const ORDER_ERROR_MESSAGES: Record<string, string> = {
  ORDER_ITEMS_REQUIRED: "Please add at least one item.",
  PRODUCT_NOT_FOUND: "Product not found.",
  VARIANT_NOT_FOUND: "Variant not found.",
  DESIGN_NOT_FOUND: "Design not found.",
  DESIGN_MUST_BE_SAVED: "Please save your design before checkout.",
  DESIGN_ACCESS_DENIED: "You do not have access to this design.",
  PRODUCT_OUT_OF_STOCK: "Product is out of stock.",
  INVALID_QUANTITY: "Quantity is invalid.",
  ORDER_NOT_FOUND: "Order not found.",
  ORDER_ACCESS_DENIED: "You do not have access to this order.",
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

function requireCustomerId(userId?: string | null) {
  const safeUserId = userId?.trim();

  if (!safeUserId) {
    throw new Error(MISSING_CUSTOMER_MESSAGE);
  }

  return safeUserId;
}

function getCustomerHeaders(userId: string) {
  return {
    // TODO: Backend currently requires X-User-Id header for Order API. Ideally this should be derived from JWT.
    "X-User-Id": userId,
  };
}

function normalizeVariantSnapshot(value: unknown): OrderVariantSnapshot {
  const snapshot = isRecord(value) ? value : {};

  return {
    size: readString(snapshot.size, "-"),
    color: readString(snapshot.color, "-"),
    material: readString(snapshot.material, "-"),
  };
}

function normalizeOrderSummary(value: unknown): OrderSummary | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id) || readString(value.orderId);
  const orderCode = readString(value.orderCode);

  if (!id && !orderCode) {
    return null;
  }

  return {
    id,
    orderId: readString(value.orderId) || id,
    orderCode: orderCode || id,
    customerId: readString(value.customerId) || undefined,
    totalAmount: readNumber(value.totalAmount),
    paymentStatus: readString(value.paymentStatus, "PENDING"),
    orderStatus: readString(value.orderStatus, "PENDING_PAYMENT"),
    createdAt: readString(value.createdAt) || undefined,
  };
}

function normalizeCreateOrderResponse(value: unknown): CreateOrderResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const orderId = readString(value.orderId) || readString(value.id);

  if (!orderId) {
    return null;
  }

  return {
    orderId,
    orderCode: readString(value.orderCode, orderId),
    totalAmount: readNumber(value.totalAmount),
    paymentStatus: readString(value.paymentStatus, "PENDING"),
    orderStatus: readString(value.orderStatus, "PENDING_PAYMENT"),
  };
}

function normalizeOrderItem(value: unknown): OrderItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);

  if (!id) {
    return null;
  }

  return {
    id,
    productId: readString(value.productId),
    productVariantId: readString(value.productVariantId),
    designId: readString(value.designId),
    productNameSnapshot: readString(value.productNameSnapshot, "Product"),
    variantSnapshot: normalizeVariantSnapshot(value.variantSnapshot),
    quantity: readNumber(value.quantity, 1),
    unitPrice: readNumber(value.unitPrice),
    totalPrice: readNumber(value.totalPrice),
  };
}

function normalizeStatusHistoryItem(value: unknown): OrderStatusHistoryItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const toStatus = readString(value.toStatus);

  if (!toStatus) {
    return null;
  }

  return {
    fromStatus: readString(value.fromStatus) || null,
    toStatus,
    note: readString(value.note) || null,
    createdAt: readString(value.createdAt) || undefined,
  };
}

function normalizeOrderDetail(value: unknown): OrderDetail | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id) || readString(value.orderId);

  if (!id) {
    return null;
  }

  return {
    id,
    orderCode: readString(value.orderCode, id),
    customerId: readString(value.customerId),
    totalAmount: readNumber(value.totalAmount),
    paymentStatus: readString(value.paymentStatus, "PENDING"),
    orderStatus: readString(value.orderStatus, "PENDING_PAYMENT"),
    receiverName: readString(value.receiverName),
    receiverPhone: readString(value.receiverPhone),
    shippingAddress: readString(value.shippingAddress),
    items: readArray(value.items)
      .map((item) => normalizeOrderItem(item))
      .filter((item): item is OrderItem => Boolean(item)),
    statusHistory: readArray(value.statusHistory)
      .map((item) => normalizeStatusHistoryItem(item))
      .filter((item): item is OrderStatusHistoryItem => Boolean(item)),
  };
}

function normalizeMyOrdersResponse(
  value: unknown,
  requestedPage: number,
  requestedPageSize: number,
): MyOrdersResponse {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => normalizeOrderSummary(item))
      .filter((item): item is OrderSummary => Boolean(item));

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
    .map((item) => normalizeOrderSummary(item))
    .filter((item): item is OrderSummary => Boolean(item));

  return {
    items,
    page: readNumber(data.page, requestedPage),
    pageSize: readNumber(data.pageSize, requestedPageSize),
    totalItems: readNumber(data.totalItems, items.length),
    totalPages: Math.max(1, readNumber(data.totalPages, 1)),
  };
}

function getOrderErrorCode(error: unknown) {
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

function getOrderResponseErrorText(error: unknown) {
  if (!axios.isAxiosError(error) || !isRecord(error.response?.data)) {
    return "";
  }

  const data = error.response.data;
  const errors = data.errors;

  if (Array.isArray(errors)) {
    const firstError = errors.find((item) => isRecord(item));

    if (isRecord(firstError)) {
      return readString(firstError.message) || readString(firstError.code);
    }
  }

  if (isRecord(errors)) {
    const firstValue = Object.values(errors)[0];

    if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
      return firstValue[0];
    }
  }

  return "";
}

export function getOrderErrorMessage(error: unknown) {
  const code = getOrderErrorCode(error);
  return (
    ORDER_ERROR_MESSAGES[code] ??
    getOrderResponseErrorText(error) ??
    getApiErrorMessage(error)
  );
}

export async function createOrder(
  payload: CreateOrderRequest,
  userId?: string | null,
) {
  const customerId = requireCustomerId(userId);
  const requestPayload = {
    ...payload,
    Description: payload.Description || payload.description || "Product order",
  };
  const response = await apiRequest<unknown>({
    url: "/api/orders",
    method: "POST",
    data: requestPayload,
    headers: getCustomerHeaders(customerId),
  });

  return mapApiResponse(response, normalizeCreateOrderResponse(response.data));
}

export async function getMyOrders(
  params: OrderListParams,
  userId?: string | null,
) {
  const customerId = requireCustomerId(userId);
  const response = await apiRequest<unknown>({
    url: "/api/orders/my",
    method: "GET",
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
    },
    headers: getCustomerHeaders(customerId),
  });

  return mapApiResponse(
    response,
    normalizeMyOrdersResponse(response.data, params.page, params.pageSize),
  );
}

export async function getOrderDetail(orderId: string, userId?: string | null) {
  const safeOrderId = orderId.trim();

  if (!safeOrderId) {
    throw new Error("Order id is required");
  }

  const customerId = userId?.trim();

  const response = await apiRequest<unknown>({
    url: `/api/orders/${safeOrderId}`,
    method: "GET",
    ...(customerId ? { headers: getCustomerHeaders(customerId) } : {}),
  });

  return mapApiResponse(response, normalizeOrderDetail(response.data));
}

export function updateOrderStatus(
  orderId: string,
  payload: UpdateOrderStatusRequest,
) {
  return apiRequest<UpdateOrderStatusResponse>({
    url: `/staff/orders/${orderId}/status`,
    method: "PATCH",
    data: payload,
  });
}

export function useCreateOrderMutation(userId?: string | null) {
  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => createOrder(payload, userId),
  });
}

export function useMyOrdersQuery(
  params: OrderListParams,
  userId?: string | null,
) {
  return useQuery<ApiResponse<MyOrdersResponse>>({
    queryKey: ["orders", "my", userId ?? "", params.page, params.pageSize],
    queryFn: () => getMyOrders(params, userId),
    enabled: Boolean(userId),
  });
}

export function useOrderDetailQuery(orderId: string, userId?: string | null) {
  return useQuery<ApiResponse<OrderDetail>>({
    queryKey: ["orders", orderId, userId ?? ""],
    queryFn: () => getOrderDetail(orderId, userId),
    enabled: Boolean(orderId),
  });
}

export function useUpdateOrderStatusMutation(orderId: string) {
  return useMutation({
    mutationFn: (payload: UpdateOrderStatusRequest) =>
      updateOrderStatus(orderId, payload),
  });
}
