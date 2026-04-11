import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
          localStorage.removeItem("auth_user");
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
