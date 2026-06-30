import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "./apiResponse";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

httpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
    }

    return Promise.reject(error);
  },
);

export async function apiRequest<T>(config: AxiosRequestConfig) {
  const response = await httpClient.request<ApiResponse<T>>(config);
  return response.data;
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return (
      error.response?.data?.errors?.[0]?.message ??
      error.response?.data?.message ??
      error.message
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
