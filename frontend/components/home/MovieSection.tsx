"use client";

import { useState } from "react";
import { Movie, MovieStatus, Showtime } from "@/types/movie";
import MovieCard from "../movie/MovieCard";
import { useMovies } from "@/hooks/useMovies";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { moviesService } from "@/services/movies";

export default function MovieSection() {
  const [activeTab, setActiveTab] = useState<MovieStatus>("now_showing");
  const { movies, loading, error } = useMovies("", "", activeTab);

  const { token } = useAuth();
  const router = useRouter();

  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleBook(movie: Movie) {
    if (!token) {
      router.push("/login");
      return;
    }

    setActiveMovie(movie);
    setShowModal(true);
    setLoadingShowtimes(true);
    setErrorMessage("");
    setShowtimes([]);

    try {
      const data = await moviesService.getShowtimesByMovieId(movie.id);
      const safeShowtimes = Array.isArray(data) ? data : [];
      setShowtimes(safeShowtimes);

      if (safeShowtimes.length === 0) {
        setErrorMessage("Hiện chưa có suất chiếu cho phim này.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Không tải được suất chiếu. Vui lòng thử lại.");
    } finally {
      setLoadingShowtimes(false);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    setActiveMovie(null);
    setShowtimes([]);
    setErrorMessage("");
  }

  function handleSelectShowtime(showtimeId: number) {
    setShowModal(false);
    router.push(`/booking/${showtimeId}`);
  }

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-5">Đang tải phim...</div>;
    }

    if (error) {
      return <div className="alert alert-danger text-center">{error}</div>;
    }

    if (!movies || !Array.isArray(movies) || movies.length === 0) {
      return (
        <div className="bg-light rounded-4 py-5 text-center">
          <p className="text-muted mb-0">Chưa có phim trong mục này.</p>
        </div>
      );
    }

    return (
      <div className="row g-4">
        {movies.map((movie) => {
          const isActive = activeMovie?.id === movie.id;
          const hasActiveMovie = !!activeMovie;

          return (
            <div key={movie.id} className="col-6 col-md-4 col-lg-3 d-flex">
              <div className="w-100">
                <MovieCard
                  movie={movie}
                  onBook={handleBook}
                  isHidden={false}
                  isDimmed={hasActiveMovie && !isActive}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section id="movies-section" className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
        <div>
          <p className="text-danger text-uppercase fw-bold small mb-2">
            Danh sách phim
          </p>
          <h2 className="fw-bold display-6 mb-0">Phim nổi bật</h2>
        </div>

        <div className="bg-light p-1 rounded-3 mt-3 mt-md-0 d-inline-flex">
          <button
            className={`btn px-4 py-2 fw-semibold rounded-3 ${
              activeTab === "now_showing"
                ? "btn-danger shadow-sm"
                : "btn-light text-muted"
            }`}
            onClick={() => setActiveTab("now_showing")}
          >
            Đang chiếu
          </button>

          <button
            className={`btn px-4 py-2 fw-semibold rounded-3 ${
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

      <div>{renderContent()}</div>

      {showModal && (
        <>
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Chọn suất chiếu
                    {activeMovie ? ` - ${activeMovie.title}` : ""}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body">
                  {loadingShowtimes && (
                    <div className="text-center py-3">
                      Đang tải suất chiếu...
                    </div>
                  )}

                  {!loadingShowtimes && errorMessage && (
                    <div className="alert alert-warning mb-0">
                      {errorMessage}
                    </div>
                  )}

                  {!loadingShowtimes &&
                    !errorMessage &&
                    showtimes.map((st) => (
                      <button
                        key={st.id}
                        className="btn btn-outline-danger w-100 mb-2"
                        onClick={() => handleSelectShowtime(st.id)}
                      >
                        {new Date(st.start_time).toLocaleString("vi-VN")}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal-backdrop show"
            style={{ zIndex: 1040 }}
            onClick={handleCloseModal}
          ></div>
        </>
      )}
    </section>
  );
}
