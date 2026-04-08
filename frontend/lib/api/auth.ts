import axiosInstance from "@/lib/axios";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  RegisterResponse,
} from "@/types/auth";
import { AxiosResponse } from "axios";

export function loginApi(
  payload: LoginPayload,
): Promise<AxiosResponse<AuthResponse>> {
  return axiosInstance.post("/auth/login", payload);
}

export function registerApi(
  payload: RegisterPayload,
): Promise<AxiosResponse<RegisterResponse>> {
  return axiosInstance.post("/auth/register", payload);
}
