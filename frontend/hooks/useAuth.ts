"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/authContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được dùng trong AuthProvider");
  }

  return context;
}

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { getToken, saveToken, removeToken } from "@/lib/utils/auth";
// import { authService } from "@/services/auth";
// import { LoginPayload } from "@/types/auth";

// export function useAuth() {
//   const [token, setToken] = useState<string | null>(null);

//   const loadToken = useCallback(() => {
//     const stored = getToken();
//     setToken(stored);
//   }, []);

//   useEffect(() => {
//     const stored = getToken();
//     if (stored) {
//       queueMicrotask(() => {
//         setToken(stored);
//       });
//     }
//   }, []);

//   const login = useCallback(async (payload: LoginPayload) => {
//     const data = await authService.login(payload);
//     if (data?.token) {
//       saveToken(data.token);
//       setToken(data.token);
//     }
//     return data;
//   }, []);

//   const logout = useCallback(() => {
//     removeToken();
//     setToken(null);
//   }, []);

//   return {
//     token,
//     isAuthenticated: !!token,
//     login,
//     logout,
//     loadToken,
//   };
// }
