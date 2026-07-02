import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type {
  CurrentUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "./types";

export function registerAccount(payload: RegisterRequest) {
  return apiRequest<RegisterResponse>({
    url: "/auth/register",
    method: "POST",
    data: payload,
  });
}

export function loginAccount(payload: LoginRequest) {
  return apiRequest<LoginResponse>({
    url: "/auth/login",
    method: "POST",
    data: payload,
  });
}

export function refreshToken(refreshToken: string) {
  return apiRequest<RefreshTokenResponse>({
    url: "/auth/refresh-token",
    method: "POST",
    data: { refreshToken },
  });
}

export function logoutAccount(refreshTokenValue: string | null) {
  return apiRequest<null>({
    url: "/auth/logout",
    method: "POST",
    data: { refreshToken: refreshTokenValue },
  });
}

export function getCurrentUser() {
  return apiRequest<CurrentUser>({
    url: "/auth/me",
    method: "GET",
  });
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: registerAccount });
}

export function useLoginMutation() {
  return useMutation({ mutationFn: loginAccount });
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: logoutAccount });
}

export function useCurrentUserQuery(enabled: boolean) {
  return useQuery<ApiResponse<CurrentUser>>({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled,
    retry: false,
  });
}
