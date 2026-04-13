// import {
//   getAdminUsersApi,
//   createAdminUserApi,
//   updateAdminUserApi,
//   deleteAdminUserApi,
//   getAdminMoviesApi,
//   getAdminBookingsApi,
//   getAdminShowtimesApi,
// } from "@/lib/api/admin";
// import {
//   AdminUser,
//   AdminMovie,
//   AdminBooking,
//   AdminShowtime,
// } from "@/types/admin";
// import { UserForm } from "@/types/user";

// /** Safely extract an array from axios response */
// function toArray<T>(res: { data: unknown }): T[] {
//   const raw = (res.data as Record<string, unknown>)?.data ?? res.data;
//   return Array.isArray(raw) ? (raw as T[]) : [];
// }

// export const adminService = {
//   async getUsers(): Promise<AdminUser[]> {
//     const res = await getAdminUsersApi();
//     return toArray<AdminUser>(res);
//   },

//   async createUser(payload: UserForm) {
//     const res = await createAdminUserApi(payload);
//     return res.data;
//   },

//   async updateUser(userId: number, payload: Partial<UserForm>) {
//     const res = await updateAdminUserApi(userId, payload);
//     return res.data;
//   },

//   async deleteUser(userId: number) {
//     const res = await deleteAdminUserApi(userId);
//     return res.data;
//   },

//   async getMovies(): Promise<AdminMovie[]> {
//     const res = await getAdminMoviesApi();
//     return toArray<AdminMovie>(res);
//   },

//   async getBookings(): Promise<AdminBooking[]> {
//     const res = await getAdminBookingsApi();
//     return toArray<AdminBooking>(res);
//   },

//   async getShowtimes(): Promise<AdminShowtime[]> {
//     const res = await getAdminShowtimesApi();
//     return toArray<AdminShowtime>(res);
//   },
// };
import {
  getAdminUsersApi,
  createAdminUserApi,
  updateAdminUserApi,
  deleteAdminUserApi,
  getAdminMoviesApi,
  createAdminMovieApi,
  updateAdminMovieApi,
  deleteAdminMovieApi,
  getAdminBookingsApi,
  updateAdminBookingStatusApi,
  getAdminShowtimesApi,
} from "@/lib/api/admin";

import {
  AdminUser,
  AdminMovie,
  AdminBooking,
  AdminShowtime,
  CreateMoviePayload,
  UpdateBookingStatusPayload,
} from "@/types/admin";

import { UserForm } from "@/types/user";

/** Safely extract an array from axios response */
function toArray<T>(res: { data: unknown }): T[] {
  const raw = (res.data as Record<string, unknown>)?.data ?? res.data;
  return Array.isArray(raw) ? (raw as T[]) : [];
}

export const adminService = {
  async getUsers(): Promise<AdminUser[]> {
    const res = await getAdminUsersApi();
    return toArray<AdminUser>(res);
  },

  async createUser(payload: UserForm) {
    const res = await createAdminUserApi(payload);
    return res.data;
  },

  async updateUser(userId: number, payload: Partial<UserForm>) {
    const res = await updateAdminUserApi(userId, payload);
    return res.data;
  },

  async deleteUser(userId: number) {
    const res = await deleteAdminUserApi(userId);
    return res.data;
  },

  async getMovies(): Promise<AdminMovie[]> {
    const res = await getAdminMoviesApi();
    return toArray<AdminMovie>(res);
  },

  async createMovie(payload: CreateMoviePayload) {
    const res = await createAdminMovieApi(payload);
    return res.data;
  },

  async updateMovie(movieId: number, payload: Partial<CreateMoviePayload>) {
    const res = await updateAdminMovieApi(movieId, payload);
    return res.data;
  },

  async deleteMovie(movieId: number) {
    const res = await deleteAdminMovieApi(movieId);
    return res.data;
  },

  async getBookings(): Promise<AdminBooking[]> {
    const res = await getAdminBookingsApi();
    return toArray<AdminBooking>(res);
  },

  async updateBookingStatus(
    bookingId: number,
    payload: UpdateBookingStatusPayload,
  ) {
    const res = await updateAdminBookingStatusApi(bookingId, payload);
    return res.data;
  },

  async getShowtimes(): Promise<AdminShowtime[]> {
    const res = await getAdminShowtimesApi();
    return toArray<AdminShowtime>(res);
  },
};
