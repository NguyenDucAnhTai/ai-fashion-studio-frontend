import { create } from "zustand";
import type { Role } from "../../shared/constants/roles";
import { normalizeUser } from "./normalizers";
import type { CurrentUser, NormalizedAuthSession } from "./types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  currentUser: CurrentUser | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  setSession: (session: NormalizedAuthSession) => void;
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
    return normalizeUser(JSON.parse(rawUser));
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  currentUser: null,
  hydrated: false,
  isAuthenticated: false,
  setSession: (session) => {
    if (session.accessToken) {
      localStorage.setItem("accessToken", session.accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (session.refreshToken) {
      localStorage.setItem("refreshToken", session.refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }

    if (session.user) {
      localStorage.setItem("currentUser", JSON.stringify(session.user));
    } else {
      localStorage.removeItem("currentUser");
    }

    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      currentUser: session.user,
      hydrated: true,
      isAuthenticated: Boolean(session.accessToken || session.user),
    });
  },
  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }

    set((state) => ({
      currentUser: user,
      isAuthenticated: Boolean(state.accessToken || user),
    }));
  },
  initFromStorage: () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const currentUser = readStoredUser();

    set({
      accessToken,
      refreshToken,
      currentUser,
      hydrated: true,
      isAuthenticated: Boolean(accessToken || currentUser),
    });
  },
  clearSession: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    set({
      accessToken: null,
      refreshToken: null,
      currentUser: null,
      hydrated: true,
      isAuthenticated: false,
    });
  },
  hasAnyRole: (roles) => {
    const user = get().currentUser ?? readStoredUser();
    const userRoles = user?.roles ?? (user?.role ? [user.role] : []);
    return userRoles.some((role) => roles.includes(role));
  },
}));
