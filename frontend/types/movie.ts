export type MovieStatus = "now_showing" | "coming_soon";

export interface Movie {
  id: number;
  title: string;
  genre: string;
  duration_min: number;
  description: string;
  poster_url: string;
  status: MovieStatus;
  release_date: string;
  director?: string;
  showtimes?: Showtime[];
}

export interface Showtime {
  id: number;
  movie_id: number;
  room_id: number;
  start_time: string;
  price: number;
  room_name?: string;
  movie_title?: string;
  subtitle?: string;
}

export interface Seat {
  id: number;
  room_id: number;
  row_label: string;
  col_number: number;
  type: "standard" | "vip";
  is_booked: boolean;
}