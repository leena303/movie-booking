import axiosInstance from "@/lib/axios";
import { CreateMoviePayload, UpdateBookingStatusPayload } from "@/types/admin";
import { UserForm } from "@/types/user";

// USERS
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

// MOVIES
export function getAdminMoviesApi() {
  return axiosInstance.get("/admin/movies");
}

export function createAdminMovieApi(payload: CreateMoviePayload) {
  return axiosInstance.post("/admin/movies", payload);
}

export function updateAdminMovieApi(
  movieId: number,
  payload: Partial<CreateMoviePayload>,
) {
  return axiosInstance.put(`/admin/movies/${movieId}`, payload);
}

export function deleteAdminMovieApi(movieId: number) {
  return axiosInstance.delete(`/admin/movies/${movieId}`);
}

// BOOKINGS
export function getAdminBookingsApi() {
  return axiosInstance.get("/admin/bookings");
}

export function updateAdminBookingStatusApi(
  bookingId: number,
  payload: UpdateBookingStatusPayload,
) {
  return axiosInstance.put(`/admin/bookings/${bookingId}/status`, payload);
}

// SHOWTIMES
export function getAdminShowtimesApi() {
  return axiosInstance.get("/admin/showtimes");
}
