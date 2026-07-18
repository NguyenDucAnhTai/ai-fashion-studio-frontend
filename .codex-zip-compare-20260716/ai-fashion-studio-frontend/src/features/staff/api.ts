import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse, PaginatedResponse } from "../../shared/api/apiResponse";
import type { StaffOrderParams, StaffOrderSummary, StaffPrintInfo } from "./types";

export function getStaffOrders(params: StaffOrderParams) {
  return apiRequest<PaginatedResponse<StaffOrderSummary>>({
    url: "/staff/orders",
    method: "GET",
    params,
  });
}

export function getStaffPrintInfo(orderId: string) {
  return apiRequest<StaffPrintInfo>({
    url: `/staff/orders/${orderId}/print-info`,
    method: "GET",
  });
}

export function useStaffOrdersQuery(params: StaffOrderParams) {
  return useQuery<ApiResponse<PaginatedResponse<StaffOrderSummary>>>({
    queryKey: ["staff", "orders", params.status ?? "", params.keyword ?? "", params.page, params.pageSize],
    queryFn: () => getStaffOrders(params),
  });
}

export function useStaffPrintInfoQuery(orderId: string) {
  return useQuery<ApiResponse<StaffPrintInfo>>({
    queryKey: ["staff", "print-info", orderId],
    queryFn: () => getStaffPrintInfo(orderId),
    enabled: Boolean(orderId),
  });
}
