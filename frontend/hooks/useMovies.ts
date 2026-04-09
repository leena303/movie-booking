"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import { moviesService } from "@/services/movies";

export function useMovies(
  search: string = "",
  genre: string = "",
  status: string = "",
) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");

        const result = await moviesService.getMovies({ search, genre, status });
        setMovies(result ? result : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được phim");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [search, genre, status]);

  return { movies, loading, error };
}
