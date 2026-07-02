import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type { CreatePaymentRequest, PaymentInfo } from "./types";

export function createPayment(payload: CreatePaymentRequest) {
  return apiRequest<PaymentInfo>({
    url: "/payments",
    method: "POST",
    data: payload,
  });
}

export function getPaymentByOrder(orderId: string) {
  return apiRequest<PaymentInfo>({
    url: `/payments/order/${orderId}`,
    method: "GET",
  });
}

export function useCreatePaymentMutation() {
  return useMutation({ mutationFn: createPayment });
}

export function usePaymentByOrderQuery(orderId: string, enabled: boolean, pollPending = false) {
  return useQuery<ApiResponse<PaymentInfo>>({
    queryKey: ["payments", "order", orderId],
    queryFn: () => getPaymentByOrder(orderId),
    enabled: Boolean(orderId) && enabled,
    retry: false,
    refetchInterval: (query) => {
      const status = (query.state.data as ApiResponse<PaymentInfo> | undefined)?.data?.paymentStatus;
      return pollPending && status === "PENDING" ? 5000 : false;
    },
  });
}
