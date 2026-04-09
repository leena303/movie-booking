"use client";

import { useMemo, useState } from "react";
import { MovieStatus } from "@/types/movie";
import MovieCard from "../movie/MovieCard";
import { useMovies } from "@/hooks/useMovies";

export default function MovieSection() {
  const [activeTab, setActiveTab] = useState<MovieStatus>("now_showing");

  const { movies, loading, error } = useMovies("", "", activeTab);

  console.log("movies", movies);
  const filteredMovies = movies
    ? movies.filter((movie) => movie.status === activeTab)
    : [];

  return (
    <section id="movies-section" className="container py-5">
      {/* 👈 thêm id ở đây */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
        <div>
          <p className="text-danger text-uppercase fw-semibold small mb-1">
            Danh sách phim
          </p>
          <h2 className="fw-bold">Phim nổi bật</h2>
        </div>

        <div className="btn-group mt-3 mt-md-0">
          <button
            className={`btn ${
              activeTab === "now_showing" ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={() => setActiveTab("now_showing")}
          >
            Đang chiếu
          </button>

          <button
            className={`btn ${
              activeTab === "coming_soon" ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={() => setActiveTab("coming_soon")}
          >
            Sắp chiếu
          </button>
        </div>
      </div>

      {/* giữ nguyên phần dưới */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" />
          <p className="mt-3">Đang tải danh sách phim...</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {/* {!loading && !error && filteredMovies.length === 0 && (
        <div className="alert alert-secondary text-center">
          Chưa có phim trong mục này.
        </div>
      )}

      {!loading && !error && filteredMovies.length > 0 && (
        <div className="row g-4">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="col-6 col-md-4 col-lg-3 d-flex">
              <div className="w-100">
                <MovieCard movie={movie} />
              </div>
            </div>
          ))}
        </div>
      )} */}
    </section>
  );
}
