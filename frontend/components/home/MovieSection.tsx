"use client";

import { useState } from "react";
import { MovieStatus } from "@/types/movie";
import MovieCard from "../movie/MovieCard";
import { useMovies } from "@/hooks/useMovies";

export default function MovieSection() {
  const [activeTab, setActiveTab] = useState<MovieStatus>("now_showing");

  const { movies, loading, error } = useMovies("", "", activeTab);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="row g-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="col-6 col-md-4 col-lg-3">
              <div
                className="card border-0 shadow-sm h-100 placeholder-glow"
                aria-hidden="true"
              >
                <div
                  className="placeholder rounded-top w-100"
                  style={{ height: 320 }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title placeholder col-10 mb-3"></h5>
                  <p className="placeholder col-8 mb-1"></p>
                  <p className="placeholder col-6 mb-1"></p>
                  <p className="placeholder col-5 mb-3"></p>
                  <div className="d-flex gap-2 mt-auto">
                    <div className="placeholder col-6 py-3 rounded"></div>
                    <div className="placeholder col-6 py-3 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger border-0 shadow-sm rounded-4 p-4 text-center">
          <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-3"></i>
          {error}
        </div>
      );
    }

    if (!movies || movies.length === 0) {
      return (
        <div className="bg-light rounded-4 py-5 text-center border-dashed">
          <p className="text-muted mb-0">Chưa có phim trong mục này.</p>
        </div>
      );
    }

    return (
      <div className="row g-4">
        {movies.map((movie) => (
          <div key={movie.id} className="col-6 col-md-4 col-lg-3 d-flex">
            <div className="w-100 transition-up">
              <MovieCard {...movie} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section id="movies-section" className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
        <div>
          <p className="text-danger text-uppercase fw-bold small mb-2 tracking-wider">
            Danh sách phim
          </p>
          <h2 className="fw-bold display-6 mb-0">Phim nổi bật</h2>
        </div>

        <div className="bg-light p-1 rounded-3 mt-3 mt-md-0 d-inline-flex">
          <button
            className={`btn px-4 py-2 fw-semibold rounded-3 transition-all ${
              activeTab === "now_showing"
                ? "btn-danger shadow-sm"
                : "btn-light text-muted"
            }`}
            onClick={() => setActiveTab("now_showing")}
          >
            Đang chiếu
          </button>

          <button
            className={`btn px-4 py-2 fw-semibold rounded-3 transition-all ${
              activeTab === "coming_soon"
                ? "btn-danger shadow-sm"
                : "btn-light text-muted"
            }`}
            onClick={() => setActiveTab("coming_soon")}
          >
            Sắp chiếu
          </button>
        </div>
      </div>

      <div className="movie-content-grid">{renderContent()}</div>
    </section>
  );
}
