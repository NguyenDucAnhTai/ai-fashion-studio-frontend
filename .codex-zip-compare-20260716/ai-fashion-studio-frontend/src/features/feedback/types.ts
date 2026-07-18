export interface PublicFeedback {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  imageUrl?: string | null;
  createdAt: string;
}

export interface PublicFeedbackParams {
  productId?: string;
  page: number;
  pageSize: number;
}

export type FeedbackStatus = "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED" | string;

export interface SubmitFeedbackRequest {
  orderId: string;
  productId: string;
  rating: number;
  comment?: string;
  imageUrl?: string;
}

export interface SubmitFeedbackResponse {
  feedbackId: string;
  status: FeedbackStatus;
}

export interface ModerateFeedbackRequest {
  status: FeedbackStatus;
  note?: string;
}

export interface ModerateFeedbackResponse {
  feedbackId: string;
  status: FeedbackStatus;
}

export interface PendingFeedbackDraft {
  feedbackId: string;
  orderId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
