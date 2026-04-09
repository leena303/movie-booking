"use client";

import { useEffect, useState } from "react";
import { AdminMovie } from "@/types/admin";
import { adminService } from "@/services/admin";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");
        const data = await adminService.getMovies();
        setMovies(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý phim</h2>
      </div>

      {loading && (
        <div className="alert alert-secondary">Đang tải dữ liệu...</div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tên phim</th>
                    <th>Thể loại</th>
                    <th>Thời lượng</th>
                    <th>Ngày chiếu</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.length > 0 ? (
                    movies.map((movie) => (
                      <tr key={movie.id}>
                        <td className="fw-semibold">{movie.title}</td>
                        <td>{movie.genre}</td>
                        <td>{movie.duration_min} phút</td>
                        <td>
                          {new Date(movie.release_date).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              movie.status === "now_showing"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {movie.status === "now_showing"
                              ? "Đang chiếu"
                              : "Sắp chiếu"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        Chưa có phim nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
