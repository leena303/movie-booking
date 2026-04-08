import { CreateBookingPayload, BookingHistoryItem } from "@/types/booking";
import { createBookingApi, getMyBookingsApi } from "@/lib/api/bookings";

export const bookingService = {
  async createBooking(payload: CreateBookingPayload) {
    const res = await createBookingApi(payload);
    return res.data;
  },

  async getMyBookings(): Promise<BookingHistoryItem[]> {
    const res = await getMyBookingsApi();
    return res.data?.data || res.data || [];
  },
};
