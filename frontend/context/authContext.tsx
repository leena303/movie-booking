"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { authService } from "@/services/auth";
import { getToken, removeToken, saveToken } from "@/lib/utils/auth";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth";
import type { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = "auth_user";
const AUTH_CHANGE_EVENT = "auth-change";
const EMPTY_AUTH_SNAPSHOT = "";

function normalizeUser(user: User): User {
  const role = user.role?.toLowerCase();

  return {
    ...user,
    role: role === "admin" ? "admin" : "user",
  };
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const savedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!savedUser) return null;

  try {
    return normalizeUser(JSON.parse(savedUser) as User);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function getAuthSnapshot(): string {
  if (typeof window === "undefined") {
    return EMPTY_AUTH_SNAPSHOT;
  }

  const token = getToken();
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!token || !rawUser) {
    return EMPTY_AUTH_SNAPSHOT;
  }

  return JSON.stringify({
    token,
    user: rawUser,
  });
}

function getServerAuthSnapshot(): string {
  return EMPTY_AUTH_SNAPSHOT;
}

function subscribeAuthStore(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

function clearStoredAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("authUser");
    localStorage.removeItem("currentUser");
  }

  removeToken();
}

function parseAuthSnapshot(snapshot: string): {
  user: User | null;
  token: string | null;
} {
  if (!snapshot || typeof window === "undefined") {
    return {
      user: null,
      token: null,
    };
  }

  try {
    const parsed = JSON.parse(snapshot) as {
      token?: string;
      user?: string;
    };

    if (!parsed.token || !parsed.user) {
      return {
        user: null,
        token: null,
      };
    }

    const user = normalizeUser(JSON.parse(parsed.user) as User);

    return {
      user,
      token: parsed.token,
    };
  } catch {
    clearStoredAuth();

    return {
      user: null,
      token: null,
    };
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authSnapshot = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  const authState = useMemo(() => {
    return parseAuthSnapshot(authSnapshot);
  }, [authSnapshot]);

  const setAuth = useCallback((nextUser: User, nextToken: string) => {
    const normalizedUser = normalizeUser(nextUser);

    saveToken(nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));

    emitAuthChange();
  }, []);

  const setUser = useCallback((nextUser: User | null) => {
    if (!nextUser) {
      localStorage.removeItem(USER_STORAGE_KEY);
      emitAuthChange();
      return;
    }

    const normalizedUser = normalizeUser(nextUser);

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
    emitAuthChange();
  }, []);

  const login = useCallback(
    async (payload: LoginPayload): Promise<AuthResponse> => {
      const data = await authService.login(payload);

      const nextToken = data?.token ?? null;
      const nextUser = data?.user ?? null;

      if (!nextToken || !nextUser) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }

      const normalizedUser = normalizeUser(nextUser);

      saveToken(nextToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));

      emitAuthChange();

      return {
        ...data,
        user: normalizedUser,
      };
    },
    [],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<RegisterResponse> => {
      return await authService.register(payload);
    },
    [],
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    emitAuthChange();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user: authState.user,
      token: authState.token,
      loading: false,
      isAuthenticated: !!authState.token && !!authState.user,
      setAuth,
      setUser,
      login,
      register,
      logout,
    }),
    [authState, setAuth, setUser, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
