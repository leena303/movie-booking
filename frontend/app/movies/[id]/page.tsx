"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Movie, Showtime } from "@/types/movie";
import { moviesService } from "@/services/movies";
import { useAuth } from "@/hooks/useAuth";

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, loadToken } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError("");

        const found = await moviesService.getMovieById(Number(id));

        if (!found) {
          setError("Không tìm thấy phim");
        } else {
          setMovie(found);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" />
        <p className="mt-3">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          {error || "Không có dữ liệu"}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0">
        <div className="row g-0">
          <div className="col-md-4">
            <div className="position-relative h-100" style={{ minHeight: 400 }}>
              <Image
                src={movie.poster_url || "/images/movie-placeholder.jpg"}
                alt={movie.title}
                fill
                className="object-fit-cover rounded-start"
              />
            </div>
          </div>

          <div className="col-md-8">
            <div className="card-body">
              <h2 className="fw-bold mb-3">{movie.title}</h2>

              <p>
                <strong>Đạo diễn:</strong>{" "}
                <span className="text-muted">{movie.director}</span>
              </p>

              <p>
                <strong>Thể loại:</strong>{" "}
                <span className="text-muted">{movie.genre}</span>
              </p>

              <p>
                <strong>Thời lượng:</strong>{" "}
                <span className="text-muted">{movie.duration_min} phút</span>
              </p>

              <p>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`badge ${
                    movie.status === "now_showing"
                      ? "bg-success"
                      : "bg-warning text-dark"
                  }`}
                >
                  {movie.status === "now_showing" ? "Đang chiếu" : "Sắp chiếu"}
                </span>
              </p>

              <div className="mb-4">
                <strong>Mô tả:</strong>
                <p className="text-muted mt-2">
                  {movie.description || "Chưa có mô tả"}
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-danger"
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

                <button
                  className="btn btn-outline-secondary"
                  onClick={() => router.back()}
                >
                  ← Quay lại
                </button>
              </div>
            </div>
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
    </div>
  );
}
