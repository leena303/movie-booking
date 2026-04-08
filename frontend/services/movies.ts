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

export const moviesService = {
  async getMovies(params?: MovieFilterParams): Promise<Movie[]> {
    const res = await getMoviesApi(params);
    return res.data?.data || res.data || [];
  },

  async getMovieById(id: string | number): Promise<Movie> {
    const res = await getMovieByIdApi(id);
    return res.data?.data || res.data;
  },

  async getShowtimesByMovieId(movieId: string | number): Promise<Showtime[]> {
    const res = await getShowtimesByMovieIdApi(movieId);
    return res.data?.data || res.data || [];
  },

  async getSeatsByShowtimeId(showtimeId: string | number): Promise<Seat[]> {
    const res = await getSeatsByShowtimeIdApi(showtimeId);
    return res.data?.data || res.data || [];
  },
};
