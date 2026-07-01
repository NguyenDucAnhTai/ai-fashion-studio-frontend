import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse, PaginatedResponse } from "../../shared/api/apiResponse";
import type {
  CreateDraftDesignRequest,
  CreateDraftDesignResponse,
  ProductDetail,
  ProductListParams,
  ProductSummary,
} from "./types";

export function getProducts(params: ProductListParams) {
  return apiRequest<PaginatedResponse<ProductSummary>>({
    url: "/products",
    method: "GET",
    params,
  });
}

export function getProductDetail(productId: string) {
  return apiRequest<ProductDetail>({
    url: `/products/${productId}`,
    method: "GET",
  });
}

export function createDraftDesign(payload: CreateDraftDesignRequest) {
  return apiRequest<CreateDraftDesignResponse>({
    url: "/designs",
    method: "POST",
    data: payload,
  });
}

export function useProductsQuery(params: ProductListParams) {
  return useQuery<ApiResponse<PaginatedResponse<ProductSummary>>>({
    queryKey: ["products", params.keyword ?? "", params.page, params.pageSize],
    queryFn: () => getProducts(params),
  });
}

export function useProductDetailQuery(productId: string) {
  return useQuery<ApiResponse<ProductDetail>>({
    queryKey: ["product", productId],
    queryFn: () => getProductDetail(productId),
    enabled: Boolean(productId),
  });
}

export function useCreateDraftDesignMutation() {
  return useMutation({
    mutationFn: createDraftDesign,
  });
}
