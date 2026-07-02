export type TryOnStatus = "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | string;

export interface CreateTryOnRequest {
  designId: string;
  userPhotoUrl: string;
  heightCm: number;
  weightKg: number;
}

export interface CreateTryOnResponse {
  tryonRequestId: string;
  status: TryOnStatus;
}

export interface TryOnRequestStatus {
  id: string;
  designId: string;
  status: TryOnStatus;
  errorMessage?: string | null;
  requestedAt: string;
  completedAt?: string | null;
}

export interface TryOnResult {
  tryonRequestId: string;
  designId: string;
  resultImageUrl: string;
  processingTimeMs: number;
  createdAt: string;
}
