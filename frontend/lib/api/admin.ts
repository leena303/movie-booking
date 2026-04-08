import axiosInstance from "@/lib/axios";
import { UserForm } from "@/types/user";

export function getAdminUsersApi() {
  return axiosInstance.get("/admin/users");
}

export function createAdminUserApi(payload: UserForm) {
  return axiosInstance.post("/admin/users", payload);
}

export function updateAdminUserApi(userId: number, payload: Partial<UserForm>) {
  return axiosInstance.put(`/admin/users/${userId}`, payload);
}

export function deleteAdminUserApi(userId: number) {
  return axiosInstance.delete(`/admin/users/${userId}`);
}

export function getAdminMoviesApi() {
  return axiosInstance.get("/admin/movies");
}

export function getAdminBookingsApi() {
  return axiosInstance.get("/admin/bookings");
}

export function getAdminShowtimesApi() {
  return axiosInstance.get("/admin/showtimes");
}
