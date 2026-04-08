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
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 400:
        console.error("❌ 400 - Bad Request:", message);
        break;

      case 401:
        console.error("❌ 401 - Unauthorized (Token hết hạn hoặc chưa login)");

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        break;

      case 403:
        console.error("❌ 403 - Forbidden (Không có quyền)");
        break;

      case 404:
        console.error("❌ 404 - Not Found:", message);
        break;

      case 500:
        console.error("❌ 500 - Server Error");
        break;

      default:
        console.error("❌ Unknown Error:", message);
        break;
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log("❌ FULL ERROR:", error);
//     console.log("❌ STATUS:", error.response?.status);
//     console.log("❌ MESSAGE:", error.response?.data);

//     return Promise.reject(error);
//   },
// );

// export default axiosInstance;

// axiosInstance.interceptors.request.use(
//   (config) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (e) {
//       console.error("Error occurred while fetching token:", e);
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );
