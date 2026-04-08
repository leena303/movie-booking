import axiosInstance from "@/lib/axios";

export function getMoviesApi(params?: {
  search?: string;
  genre?: string;
  status?: string;
}) {
  return axiosInstance.get("/movies", {
    params: {
      search: params?.search || "",
      genre: params?.genre || "",
      status: params?.status || "",
    },
  });
}

export function getMovieByIdApi(id: string | number) {
  return axiosInstance.get(`/movies/${id}`);
}

export function getShowtimesByMovieIdApi(movieId: string | number) {
  return axiosInstance.get(`/showtimes/movie/${movieId}`);
}

export function getSeatsByShowtimeIdApi(showtimeId: string | number) {
  return axiosInstance.get(`/seats/showtimes/${showtimeId}/seats`);
}
