export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: import("./user").User;
}

export interface RegisterResponse {
  message?: string;
  token?: string;
  user?: import("./user").User;
}
