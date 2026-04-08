"use client";

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, token, setAuth, logout, loadToken } = useAuthStore();

  return {
    user,
    token,
    setAuth,
    logout,
    loadToken,
    isAuthenticated: !!token,
  };
}