export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "user" | "admin";
}

export interface UserForm {
  name: string;
  email: string;
  role: string;
  password: string;
}