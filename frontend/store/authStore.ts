"use client";

import { create } from "zustand";
import { User } from "@/types/user";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  RegisterResponse,
} from "@/types/auth";
import { getToken, removeToken, saveToken } from "@/lib/utils/auth";
import { authService } from "@/services/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  logout: () => void;
  loadToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    saveToken(token);
    set({ user, token });
  },

  setUser: (user) => {
    set({ user });
  },

  login: async (payload) => {
    const data = await authService.login(payload);

    const token = data?.token;
    const user = data?.user;

    if (token) {
      saveToken(token);
    }

    set({
      token: token || null,
      user: user || null,
    });

    return data;
  },

  register: async (payload) => {
    const data = await authService.register(payload);
    return data;
  },

  logout: () => {
    removeToken();
    set({ user: null, token: null });
  },

  loadToken: () => {
    const token = getToken();
    if (token) {
      set({ token });
    }
  },
}));
