import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse, PaginatedResponse } from "../../shared/api/apiResponse";
import type { DesignDetail, DesignSummary, SaveDesignRequest, SaveDesignResponse } from "./types";

export interface MyDesignsParams {
  page: number;
  pageSize: number;
}

export function getMyDesigns(params: MyDesignsParams) {
  return apiRequest<PaginatedResponse<DesignSummary>>({
    url: "/designs/my",
    method: "GET",
    params,
  });
}

export function getDesignDetail(designId: string) {
  return apiRequest<DesignDetail>({
    url: `/designs/${designId}`,
    method: "GET",
  });
}

export function saveDesign(designId: string, payload: SaveDesignRequest) {
  return apiRequest<SaveDesignResponse>({
    url: `/designs/${designId}/save`,
    method: "PUT",
    data: payload,
  });
}

export function useMyDesignsQuery(params: MyDesignsParams) {
  return useQuery<ApiResponse<PaginatedResponse<DesignSummary>>>({
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
