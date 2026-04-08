export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "admin" | "user";
  created_at: string;
}

export interface AdminMovie {
  id: number;
  title: string;
  genre: string;
  duration_min: number;
  description: string;
  poster_url: string;
  status: "now_showing" | "coming_soon";
  release_date: string;
}

export interface AdminShowtime {
  id: number;
  movie_id: number;
  room_id: number;
  start_time: string;
  price: number;
  movie_title?: string;
  room_name?: string;
}

export interface AdminRoom {
  id: number;
  name: string;
  total_rows: number;
  total_cols: number;
}

export interface AdminSeat {
  id: number;
  room_id: number;
  row_label: string;
  col_number: number;
  type: "standard" | "vip";
}

export interface AdminBooking {
  booking_id: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  movie_title: string;
  start_time: string;
  room_name: string;
  user_name?: string;
  email?: string;
}

export interface CreateMoviePayload {
  title: string;
  genre: string;
  duration_min: number;
  description: string;
  poster_url: string;
  status: "now_showing" | "coming_soon";
  release_date: string;
}

export interface CreateShowtimePayload {
  movie_id: number;
  room_id: number;
  start_time: string;
  price: number;
}

export interface CreateRoomPayload {
  name: string;
  total_rows: number;
  total_cols: number;
}

export interface CreateSeatPayload {
  row_label: string;
  col_number: number;
  type: "standard" | "vip";
}

export interface UpdateUserRolePayload {
  role: "admin" | "user";
}

export interface UpdateBookingStatusPayload {
  status: "pending" | "confirmed" | "cancelled";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}
