"use client";

import { useEffect, useState } from "react";
import { AdminShowtime } from "@/types/admin";
import { adminService } from "@/services/admin";

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<AdminShowtime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchShowtimes() {
      try {
        setLoading(true);
        setError("");
        const data = await adminService.getShowtimes();
        setShowtimes(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }

    fetchShowtimes();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý lịch chiếu</h2>
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
                    <th>Phim</th>
                    <th>Phòng</th>
                    <th>Thời gian</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {showtimes.length > 0 ? (
                    showtimes.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-semibold">
                          {item.movie_title || "N/A"}
                        </td>
                        <td>{item.room_name || "N/A"}</td>
                        <td>
                          {new Date(item.start_time).toLocaleString("vi-VN")}
                        </td>
                        <td>{Number(item.price).toLocaleString("vi-VN")}đ</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        Chưa có lịch chiếu nào
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
