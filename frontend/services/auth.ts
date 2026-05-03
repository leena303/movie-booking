import { loginApi, registerApi } from "@/lib/api/auth";
import axiosInstance from "@/lib/axios";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  RegisterResponse,
} from "@/types/auth";
import type { User } from "@/types/user";

type UpdateMePayload = {
  name?: string;
  phone?: string;
  address?: string;
  oldPassword?: string;
  newPassword?: string;
};

type UpdateMeResponse = {
  message: string;
  user: User;
};

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const res = await loginApi(payload);
      return res.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập thất bại";

      if (message.toLowerCase().includes("invalid email or password")) {
        throw new Error("Email hoặc mật khẩu không đúng");
      }

      throw new Error(message);
    }
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const res = await registerApi(payload);
      return res.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Đăng ký thất bại");
    }
  },

  async updateMe(payload: UpdateMePayload): Promise<UpdateMeResponse> {
    const res = await axiosInstance.put("/auth/me", payload);
    return res.data;
  },
};
