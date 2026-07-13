import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiRequest, getApiErrorMessage } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import { ROLES, type Role } from "../../shared/constants/roles";
import type { CurrentUser } from "../auth/types";
import type {
  AvatarUploadResponse,
  UpdateProfileRequest,
  UserProfile,
} from "./types";

export const MY_PROFILE_QUERY_KEY = ["users", "me", "profile"] as const;

const ROLE_VALUES = new Set<string>(Object.values(ROLES));

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRole(value: unknown) {
  const role = readString(value);
  return ROLE_VALUES.has(role) ? (role as Role) : null;
}

function normalizeRoles(value: unknown) {
  if (!Array.isArray(value)) {
    const role = normalizeRole(value);
    return role ? [role] : [];
  }

  return value
    .map((item) => normalizeRole(item))
    .filter((item): item is Role => Boolean(item));
}

function normalizeProfile(value: unknown): UserProfile | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const email = readString(value.email);
  const fullName = readString(value.fullName);
  const roles = normalizeRoles(value.roles);
  const status = readString(value.status);

  if (!id || !email || !fullName || !status) {
    return null;
  }

  return {
    id,
    email,
    fullName,
    phone: readString(value.phone) || null,
    avatarUrl: readString(value.avatarUrl) || null,
    roles,
    status,
  };
}

function normalizeAvatarResponse(value: unknown): AvatarUploadResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const avatarUrl = readString(value.avatarUrl);
  return avatarUrl ? { avatarUrl } : null;
}

function normalizeFieldName(field: string) {
  const normalized = field.charAt(0).toLowerCase() + field.slice(1);

  if (normalized === "fullName" || normalized === "phone") {
    return normalized;
  }

  return null;
}

export function profileToCurrentUser(
  profile: UserProfile,
  currentUser?: CurrentUser | null,
): CurrentUser {
  return {
    ...currentUser,
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    phone: profile.phone,
    avatarUrl: profile.avatarUrl,
    roles: profile.roles,
    role: profile.roles[0],
    status: profile.status,
  };
}

export function getProfileFieldErrors(error: unknown) {
  const fieldErrors: Partial<Record<keyof UpdateProfileRequest, string>> = {};

  if (!axios.isAxiosError(error) || !isRecord(error.response?.data)) {
    return fieldErrors;
  }

  const errors = error.response.data.errors;

  if (Array.isArray(errors)) {
    errors.forEach((item) => {
      if (!isRecord(item)) {
        return;
      }

      const field = normalizeFieldName(readString(item.field));
      const message = readString(item.message);

      if (field && message) {
        fieldErrors[field] = message;
      }
    });

    return fieldErrors;
  }

  if (isRecord(errors)) {
    Object.entries(errors).forEach(([fieldName, messages]) => {
      const field = normalizeFieldName(fieldName);
      const message = Array.isArray(messages)
        ? readString(messages[0])
        : readString(messages);

      if (field && message) {
        fieldErrors[field] = message;
      }
    });
  }

  return fieldErrors;
}

export function getProfileErrorTitle(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    return "User not found";
  }

  return "Cannot load profile";
}

export function getAvatarErrorMessage(error: unknown) {
  const message = getApiErrorMessage(error);

  if (message === "AVATAR_FILE_REQUIRED") {
    return "Please choose an avatar image before uploading.";
  }

  if (message === "AVATAR_FILE_TOO_LARGE") {
    return "Avatar must be 5MB or smaller.";
  }

  if (message === "AVATAR_CONTENT_TYPE_INVALID") {
    return "Avatar must be a JPEG, PNG, or WebP image.";
  }

  return message;
}

export async function getMyProfile() {
  const response = await apiRequest<unknown>({
    url: "/api/users/me/profile",
    method: "GET",
  });

  return {
    ...response,
    data: normalizeProfile(response.data),
  } satisfies ApiResponse<UserProfile>;
}

export async function updateMyProfile(payload: UpdateProfileRequest) {
  const response = await apiRequest<unknown>({
    url: "/api/users/me/profile",
    method: "PATCH",
    data: payload,
  });

  return {
    ...response,
    data: normalizeProfile(response.data),
  } satisfies ApiResponse<UserProfile>;
}

export async function uploadMyAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest<unknown>({
    url: "/api/users/me/avatar",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    ...response,
    data: normalizeAvatarResponse(response.data),
  } satisfies ApiResponse<AvatarUploadResponse>;
}

export function useMyProfileQuery() {
  return useQuery<ApiResponse<UserProfile>>({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
  });
}

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
    },
  });
}

export function useUploadMyAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadMyAvatar,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
    },
  });
}
