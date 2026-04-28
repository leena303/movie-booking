export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "user" | "admin";
  avatar?: string | null;
}

export interface UserForm {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  password: string;
  confirmPassword?: string;
}
