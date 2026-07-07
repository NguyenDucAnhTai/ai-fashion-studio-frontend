import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../../shared/api/httpClient";
import type { ApiResponse } from "../../../shared/api/apiResponse";
import type { AdminCatalog, CreateCatalogRequest } from "./types";

export function getAdminCatalogs() {
  return apiRequest<AdminCatalog[]>({
    url: "/admin/catalogs",
    method: "GET",
  });
}

export function getAdminCatalogById(id: string) {
  return apiRequest<AdminCatalog>({
    url: `/admin/catalogs/${id}`,
    method: "GET",
  });
}

export function createAdminCatalog(payload: CreateCatalogRequest) {
  return apiRequest<AdminCatalog>({
    url: "/admin/catalogs/create",
    method: "POST",
    data: payload,
  });
}

export function useAdminCatalogsQuery() {
  return useQuery<ApiResponse<AdminCatalog[]>>({
    queryKey: ["admin", "catalogs"],
    queryFn: getAdminCatalogs,
  });
}

export function useAdminCatalogDetailQuery(id: string) {
  return useQuery<ApiResponse<AdminCatalog>>({
    queryKey: ["admin", "catalogs", id],
    queryFn: () => getAdminCatalogById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAdminCatalogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminCatalog,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "catalogs"] });
    },
  });
}
