export interface ApiMeta {
  requestId: string;
  timestamp: string;
}

export interface ApiError {
  field?: string;
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: ApiError[] | null;
  meta: ApiMeta;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
