import { loginApi, registerApi } from "@/lib/api/auth";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  RegisterResponse,
} from "@/types/auth";

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
};
