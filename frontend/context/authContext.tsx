"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
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
  loadToken: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = "auth_user";

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const savedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function clearStoredAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
  removeToken();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadToken = useCallback(() => {
    const savedToken = getToken();
    const savedUser = getStoredUser();

    if (!savedToken || !savedUser) {
      clearStoredAuth();
      setUser(null);
      setToken(null);
      return;
    }

    setUser(savedUser);
    setToken(savedToken);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadToken();
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [loadToken]);

  const setAuth = useCallback((nextUser: User, nextToken: string) => {
    saveToken(nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setToken(nextToken);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload): Promise<AuthResponse> => {
      const data = await authService.login(payload);

      const nextToken = data?.token ?? null;
      const nextUser = data?.user ?? null;

      if (!nextToken || !nextUser) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }

      saveToken(nextToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));

      setToken(nextToken);
      setUser(nextUser);

      return data;
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
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      setAuth,
      setUser,
      login,
      register,
      logout,
      loadToken,
    }),
    [user, token, loading, setAuth, login, register, logout, loadToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
