import axios from "axios";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  const directToken =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("auth_token");

  if (directToken) {
    return directToken.replace(/^"|"$/g, "");
  }

  const authUserRaw = localStorage.getItem("auth_user");
  if (authUserRaw) {
    try {
      const authUser = JSON.parse(authUserRaw);
      const nestedToken =
        authUser?.token || authUser?.accessToken || authUser?.access_token;

      if (nestedToken && typeof nestedToken === "string") {
        return nestedToken.replace(/^"|"$/g, "");
      }
    } catch {}
  }

  return null;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const rawMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Đã xảy ra lỗi";

    const message =
      typeof rawMessage === "string"
        ? rawMessage.replace(/^"|"$/g, "")
        : "Đã xảy ra lỗi";

    const isLoginRequest = url.includes("/auth/login");
    const isAdminRequest = url.includes("/admin");

    switch (status) {
      case 400:
        if (!isLoginRequest) {
          console.error("❌ 400 - Bad Request:", message);
        }
        break;

      case 401:
        console.error("❌ 401 - Unauthorized:", message);

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");

          if (isAdminRequest && window.location.pathname.startsWith("/admin")) {
            window.location.href = "/login";
          }
        }
        break;

      case 403:
        console.error("❌ 403 - Forbidden:", message);
        break;

      case 404:
        console.error("❌ 404 - Not Found:", message);
        break;

      case 500:
        console.error("❌ 500 - Server Error:", message);
        break;

      default:
        if (!isLoginRequest) {
          console.error("❌ Unknown Error:", message);
        }
        break;
    }

    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;
