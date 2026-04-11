import { CreateBookingPayload, BookingHistoryItem } from "@/types/booking";
import { createBookingApi, getMyBookingsApi } from "@/lib/api/bookings";

function toArray<T>(res: { data: unknown }): T[] {
  const raw = (res.data as Record<string, unknown>)?.data ?? res.data;
  return Array.isArray(raw) ? (raw as T[]) : [];
}

export const bookingService = {
  async createBooking(payload: CreateBookingPayload) {
    const res = await createBookingApi(payload);
    return res.data;
  },

  async getMyBookings(): Promise<BookingHistoryItem[]> {
    const res = await getMyBookingsApi();
    return toArray<BookingHistoryItem>(res);
  },
};
