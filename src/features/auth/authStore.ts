import { create } from "zustand";
import type { Role } from "../../shared/constants/roles";
import type { CurrentUser, LoginResponse } from "./types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  currentUser: CurrentUser | null;
  hydrated: boolean;
  setSession: (session: LoginResponse) => void;
  setCurrentUser: (user: CurrentUser | null) => void;
  initFromStorage: () => void;
  clearSession: () => void;
  hasAnyRole: (roles: Role[]) => boolean;
}

function readStoredUser() {
  const rawUser = localStorage.getItem("currentUser");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as CurrentUser;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  currentUser: null,
  hydrated: false,
  setSession: (session) => {
    localStorage.setItem("accessToken", session.accessToken);
    localStorage.setItem("refreshToken", session.refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(session.user));
    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      currentUser: session.user,
      hydrated: true,
    });
  },
  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }

    set({ currentUser: user });
  },
  initFromStorage: () => {
    set({
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
      currentUser: readStoredUser(),
      hydrated: true,
    });
  },
  clearSession: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    set({ accessToken: null, refreshToken: null, currentUser: null, hydrated: true });
  },
  hasAnyRole: (roles) => {
    const userRoles = get().currentUser?.roles ?? readStoredUser()?.roles ?? [];
    return userRoles.some((role) => roles.includes(role));
  },
}));
