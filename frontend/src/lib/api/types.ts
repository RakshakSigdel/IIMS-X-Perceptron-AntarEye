export interface ApiErrorBody {
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  error: ApiErrorBody | null;
  meta?: unknown;
}
