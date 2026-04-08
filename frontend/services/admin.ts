import {
  getAdminUsersApi,
  createAdminUserApi,
  updateAdminUserApi,
  deleteAdminUserApi,
  getAdminMoviesApi,
  getAdminBookingsApi,
  getAdminShowtimesApi,
} from "@/lib/api/admin";
import {
  AdminUser,
  AdminMovie,
  AdminBooking,
  AdminShowtime,
} from "@/types/admin";
import { UserForm } from "@/types/user";

export const adminService = {
  async getUsers(): Promise<AdminUser[]> {
    const res = await getAdminUsersApi();
    return res.data?.data || [];
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
    return res.data?.data || [];
  },

  async getBookings(): Promise<AdminBooking[]> {
    const res = await getAdminBookingsApi();
    return res.data?.data || [];
  },

  async getShowtimes(): Promise<AdminShowtime[]> {
    const res = await getAdminShowtimesApi();
    return res.data?.data || [];
  },
};
