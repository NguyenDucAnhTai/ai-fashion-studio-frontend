import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type { CreateTryOnRequest, CreateTryOnResponse, TryOnRequestStatus, TryOnResult } from "./types";

export function createTryOnRequest(payload: CreateTryOnRequest) {
  return apiRequest<CreateTryOnResponse>({
    url: "/tryon/requests",
    method: "POST",
    data: payload,
  });
}

export function getTryOnStatus(requestId: string) {
  return apiRequest<TryOnRequestStatus>({
    url: `/tryon/requests/${requestId}`,
    method: "GET",
  });
}

export function getTryOnResult(requestId: string) {
  return apiRequest<TryOnResult>({
    url: `/tryon/requests/${requestId}/result`,
    method: "GET",
  });
}

export function useCreateTryOnMutation() {
  return useMutation({ mutationFn: createTryOnRequest });
}

export function useTryOnStatusQuery(requestId: string) {
  return useQuery<ApiResponse<TryOnRequestStatus>>({
    queryKey: ["tryon", "status", requestId],
    queryFn: () => getTryOnStatus(requestId),
    enabled: Boolean(requestId),
    refetchInterval: (query) => {
      const status = (query.state.data as ApiResponse<TryOnRequestStatus> | undefined)?.data?.status;
      return status === "SUCCEEDED" || status === "FAILED" ? false : 3000;
    },
  });
}

export function useTryOnResultQuery(requestId: string, enabled: boolean) {
  return useQuery<ApiResponse<TryOnResult>>({
    queryKey: ["tryon", "result", requestId],
    queryFn: () => getTryOnResult(requestId),
    enabled: Boolean(requestId) && enabled,
    retry: false,
  });
}
