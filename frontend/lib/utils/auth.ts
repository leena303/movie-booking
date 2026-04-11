// import { User } from "@/types/user";

export const TOKEN_KEY = "token";

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// export function saveToken(token: string) {
//   localStorage.setItem("token", token);
// }

// export function getToken() {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("token");
// }

// export function removeToken() {
//   localStorage.removeItem("token");
// }

// export function saveUser(user: User) {
//   localStorage.setItem("user", JSON.stringify(user));
// }

// export function getUser(): User | null {
//   if (typeof window === "undefined") return null;
//   const user = localStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// }

// export function removeUser() {
//   localStorage.removeItem("user");
// }
