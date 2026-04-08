import axiosInstance from "@/lib/axios";
import { CreateBookingPayload } from "@/types/booking";

export function createBookingApi(payload: CreateBookingPayload) {
  return axiosInstance.post("/bookings", payload);
}

export function getMyBookingsApi() {
  return axiosInstance.get("/bookings/my-bookings");
}
