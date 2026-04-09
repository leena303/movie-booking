import {
  getMoviesApi,
  getMovieByIdApi,
  getShowtimesByMovieIdApi,
  getSeatsByShowtimeIdApi,
} from "@/lib/api/movies";

import { Movie, Showtime, Seat } from "@/types/movie";

interface MovieFilterParams {
  search?: string;
  genre?: string;
  status?: string;
}

/** Safely extract an array from axios response */
function toArray<T>(res: { data: unknown }): T[] {
  const raw = (res.data as Record<string, unknown>)?.data ?? res.data;
  return Array.isArray(raw) ? (raw as T[]) : [];
}

export const moviesService = {
  async getMovies(params?: MovieFilterParams): Promise<Movie[]> {
    const res = await getMoviesApi(params);
    return toArray<Movie>(res);
  },

  async getMovieById(id: string | number): Promise<Movie> {
    const res = await getMovieByIdApi(id);
    const raw = res.data as Record<string, unknown>;
    return (raw?.data ?? raw) as Movie;
  },

  async getShowtimesByMovieId(movieId: string | number): Promise<Showtime[]> {
    const res = await getShowtimesByMovieIdApi(movieId);
    return toArray<Showtime>(res);
  },

  async getSeatsByShowtimeId(showtimeId: string | number): Promise<Seat[]> {
    const res = await getSeatsByShowtimeIdApi(showtimeId);
    return toArray<Seat>(res);
  },
};
