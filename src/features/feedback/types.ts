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
