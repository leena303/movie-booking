import { loginApi, registerApi } from "@/lib/api/auth";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  RegisterResponse,
} from "@/types/auth";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await loginApi(payload);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const res = await registerApi(payload);
    return res.data;
  },
};
