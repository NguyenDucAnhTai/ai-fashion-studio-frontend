import type { Role } from "../../shared/constants/roles";

export interface CurrentUser {
  id?: string;
  email: string;
  fullName?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role?: Role;
  roles: Role[];
  status?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresIn?: number;
  user?: CurrentUser | null;
}

export interface RefreshTokenResponse {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresIn?: number;
}

export interface NormalizedAuthSession {
  accessToken: string | null;
  refreshToken: string | null;
  user: CurrentUser | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
