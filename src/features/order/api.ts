import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse, PaginatedResponse } from "../../shared/api/apiResponse";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderDetail,
  OrderSummary,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "./types";

export interface OrderListParams {
  page: number;
  pageSize: number;
}

export function createOrder(payload: CreateOrderRequest) {
  return apiRequest<CreateOrderResponse>({
    url: "/orders",
    method: "POST",
    data: payload,
  });
}

export function getMyOrders(params: OrderListParams) {
  return apiRequest<PaginatedResponse<OrderSummary>>({
    url: "/orders/my",
    method: "GET",
    params,
  });
}

export function getOrderDetail(orderId: string) {
  return apiRequest<OrderDetail>({
    url: `/orders/${orderId}`,
    method: "GET",
  });
}

export function updateOrderStatus(orderId: string, payload: UpdateOrderStatusRequest) {
  return apiRequest<UpdateOrderStatusResponse>({
    url: `/staff/orders/${orderId}/status`,
    method: "PATCH",
    data: payload,
  });
}

export function useCreateOrderMutation() {
  return useMutation({ mutationFn: createOrder });
}

export function useMyOrdersQuery(params: OrderListParams) {
  return useQuery<ApiResponse<PaginatedResponse<OrderSummary>>>({
    queryKey: ["orders", "my", params.page, params.pageSize],
    queryFn: () => getMyOrders(params),
  });
}

export function useOrderDetailQuery(orderId: string) {
  return useQuery<ApiResponse<OrderDetail>>({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderDetail(orderId),
    enabled: Boolean(orderId),
  });
}

export function useUpdateOrderStatusMutation(orderId: string) {
  return useMutation({
    mutationFn: (payload: UpdateOrderStatusRequest) => updateOrderStatus(orderId, payload),
  });
}
