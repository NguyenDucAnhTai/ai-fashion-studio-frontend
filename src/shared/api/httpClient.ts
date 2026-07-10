import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "./apiResponse";
import { useAuthStore } from "../../features/auth/authStore";

const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/api\/?$/, "");

const AUTH_ENTRYPOINTS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/verify-reset-otp",
  "/api/auth/reset-password",
];

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeApiPath(url?: string) {
  if (!url || /^https?:\/\//i.test(url) || url.startsWith("/api/")) {
    return url;
  }

  return url.startsWith("/") ? `/api${url}` : `/api/${url}`;
}

function getAccessToken() {
  return useAuthStore.getState().accessToken ?? localStorage.getItem("accessToken");
}

function readMessage(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeApiEnvelope<T>(payload: Partial<ApiResponse<T>>): ApiResponse<T> {
  return {
    success: payload.success ?? true,
    message: payload.message ?? "Success",
    data: (payload.data ?? null) as T | null,
    errors: payload.errors ?? null,
    meta: payload.meta ?? {
      requestId: "client-normalized",
      timestamp: new Date().toISOString(),
    },
  };
}

httpClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  config.url = normalizeApiPath(config.url);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const requestUrl = normalizeApiPath(error.config?.url);
    const isAuthEntrypoint = AUTH_ENTRYPOINTS.some((url) => requestUrl?.includes(url));

    if (error.response?.status === 401 && !isAuthEntrypoint) {
      useAuthStore.getState().clearSession();
    }

    return Promise.reject(error);
  },
);

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await httpClient.request<ApiResponse<T> | T>(config);
  const payload = response.data;

  if (isRecord(payload) && "data" in payload) {
    return normalizeApiEnvelope(payload as Partial<ApiResponse<T>>);
  }

  return {
    success: true,
    message: "Success",
    data: payload as T,
    errors: null,
    meta: {
      requestId: "client-normalized",
      timestamp: new Date().toISOString(),
    },
  } satisfies ApiResponse<T>;
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (isRecord(data)) {
      const errors = data.errors;
      const firstError = Array.isArray(errors) ? errors[0] : null;

      if (isRecord(firstError)) {
        const errorMessage = readMessage(firstError.message);

        if (errorMessage) {
          return errorMessage;
        }
      }

      return (
        readMessage(data.message) ??
        readMessage(data.title) ??
        readMessage(data.detail) ??
        (isRecord(data.error) ? readMessage(data.error.message) : null) ??
        error.message
      );
    }

    return (
      error.message
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
