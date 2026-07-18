import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import { normalizeUser } from "./normalizers";
import type {
  CurrentUser,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  RegisterRequest,
  RegisterResponse,
  VerifyResetOtpRequest,
} from "./types";

export function registerAccount(payload: RegisterRequest) {
  return apiRequest<RegisterResponse>({
    url: "/auth/register",
    method: "POST",
    data: payload,
  });
}

export function loginAccount(payload: LoginRequest) {
  return apiRequest<unknown>({
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

export function logoutAccount(refreshTokenValue?: string | null) {
  return apiRequest<null>({
    url: "/auth/logout",
    method: "POST",
    data: refreshTokenValue ? { refreshToken: refreshTokenValue } : {},
  });
}

export async function getCurrentUser() {
  const response = await apiRequest<unknown>({
    url: "/auth/me",
    method: "GET",
  });

  return {
    ...response,
    data: normalizeUser(response.data),
  } satisfies ApiResponse<CurrentUser>;
}

export function forgotPassword(payload: ForgotPasswordRequest) {
  return apiRequest<unknown>({
    url: "/auth/forgot-password",
    method: "POST",
    data: payload,
  });
}

export function verifyResetOtp(payload: VerifyResetOtpRequest) {
  return apiRequest<unknown>({
    url: "/auth/verify-reset-otp",
    method: "POST",
    data: payload,
  });
}

export function resetPassword(payload: ResetPasswordRequest) {
  return apiRequest<unknown>({
    url: "/auth/reset-password",
    method: "POST",
    data: payload,
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

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useVerifyResetOtpMutation() {
  return useMutation({ mutationFn: verifyResetOtp });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: resetPassword });
}

export function useCurrentUserQuery(enabled: boolean) {
  return useQuery<ApiResponse<CurrentUser>>({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled,
    retry: false,
  });
}
