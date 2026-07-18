import type { Role } from "../../shared/constants/roles";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  roles: Role[];
  status: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone?: string | null;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
}
