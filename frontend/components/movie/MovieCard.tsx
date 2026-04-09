"use client";

import Image from "next/image";
import { Movie, Showtime } from "@/types/movie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { moviesService } from "@/services/movies";
import { useState } from "react";

export default function MovieCard(movie: Movie) {
  const router = useRouter();
  const { token } = useAuth();

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card border-0 shadow-sm h-100">
        <div className="position-relative" style={{ height: 320 }}>
          <Image
            src={movie.poster_url || "/images/movie-placeholder.jpg"}
            alt={movie.title}
            fill
            className="object-fit-cover rounded-top"
          />

          <span
            className={`badge position-absolute top-0 start-0 m-2 ${
              movie.status === "now_showing"
                ? "bg-danger"
                : "bg-warning text-dark"
            }`}
          >
            {movie.status === "now_showing" ? "Đang chiếu" : "Sắp chiếu"}
          </span>
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={{ minHeight: 48 }}>
            {movie.title}
          </h5>

          <p className="mb-1 small text-muted">
            <strong>Đạo diễn:</strong> {movie.director}
          </p>

          <p className="mb-1 small text-muted">
            <strong>Thể loại:</strong> {movie.genre}
          </p>

          <p className="mb-3 small text-muted">
            <strong>Thời lượng:</strong> {movie.duration_min} phút
          </p>

          <div className="d-flex gap-2 mt-auto">
            <button
              className="btn btn-outline-danger btn-sm w-100"
              onClick={() => router.push(`/movies/${movie.id}`)}
            >
              Chi tiết
            </button>

            <button
              className="btn btn-danger btn-sm w-100"
              onClick={async () => {
                if (!token) {
                  router.push("/login");
                  return;
                }

                try {
                  const data = await moviesService.getShowtimesByMovieId(
                    movie.id,
                  );
                  setShowtimes(data);
                  setShowModal(true);
                } catch (err) {
                  console.error(err);
                  alert("Không tải được suất chiếu");
                }
              }}
            >
              Đặt vé
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chọn suất chiếu</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {showtimes.length === 0 && (
                    <p className="text-muted">Không có suất chiếu</p>
                  )}

                  {showtimes.map((st) => (
                    <button
                      key={st.id}
                      className="btn btn-outline-danger w-100 mb-2"
                      onClick={() => {
                        setShowModal(false);
                        router.push(`/booking/${st.id}`);
                      }}
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
            onClick={() => setShowModal(false)}
          ></div>
        </>
      )}
    </>
  );
}
