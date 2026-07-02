import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse, PaginatedResponse } from "../../shared/api/apiResponse";
import type {
  ModerateFeedbackRequest,
  ModerateFeedbackResponse,
  PublicFeedback,
  PublicFeedbackParams,
  SubmitFeedbackRequest,
  SubmitFeedbackResponse,
} from "./types";

export function getPublicFeedbacks(params: PublicFeedbackParams) {
  return apiRequest<PaginatedResponse<PublicFeedback>>({
    url: "/feedbacks/public",
    method: "GET",
    params,
  });
}

export function submitFeedback(payload: SubmitFeedbackRequest) {
  return apiRequest<SubmitFeedbackResponse>({
    url: "/feedbacks",
    method: "POST",
    data: payload,
  });
}

export function moderateFeedback(feedbackId: string, payload: ModerateFeedbackRequest) {
  return apiRequest<ModerateFeedbackResponse>({
    url: `/admin/feedbacks/${feedbackId}/status`,
    method: "PATCH",
    data: payload,
  });
}

export function usePublicFeedbackQuery(params: PublicFeedbackParams) {
  return useQuery<ApiResponse<PaginatedResponse<PublicFeedback>>>({
    queryKey: ["feedbacks", "public", params.productId ?? "", params.page, params.pageSize],
    queryFn: () => getPublicFeedbacks(params),
  });
}

export function useSubmitFeedbackMutation() {
  return useMutation({ mutationFn: submitFeedback });
}

export function useModerateFeedbackMutation(feedbackId: string) {
  return useMutation({
    mutationFn: (payload: ModerateFeedbackRequest) => moderateFeedback(feedbackId, payload),
  });
}
