"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { moviesService } from "@/services/movies";
import { Movie } from "@/types/movie";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moviesService
      .getMovies()
      .then((data) => {
        console.log("movies response:", data);
        setMovies(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" />
        <p className="mt-3">Đang tải danh sách phim...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Xem phim ngay</h2>

      <div className="row g-4">
        {movies.map((movie) => (
          <div key={movie.id} className="col-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              <Image
                src={movie.poster_url}
                alt={movie.title}
                width={300}
                height={450}
                className="card-img-top"
                style={{ objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold">{movie.title}</h6>

                <Link
                  href={`/movies/${movie.id}`}
                  className="btn btn-danger btn-sm mt-auto"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
