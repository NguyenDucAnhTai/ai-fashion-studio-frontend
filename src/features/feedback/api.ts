import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse, PaginatedResponse } from "../../shared/api/apiResponse";
import type { PublicFeedback, PublicFeedbackParams } from "./types";

export function getPublicFeedbacks(params: PublicFeedbackParams) {
  return apiRequest<PaginatedResponse<PublicFeedback>>({
    url: "/feedbacks/public",
    method: "GET",
    params,
  });
}

export function usePublicFeedbackQuery(params: PublicFeedbackParams) {
  return useQuery<ApiResponse<PaginatedResponse<PublicFeedback>>>({
    queryKey: ["feedbacks", "public", params.productId ?? "", params.page, params.pageSize],
    queryFn: () => getPublicFeedbacks(params),
  });
}
