"use client";

import { useEffect, useState } from "react";
import { AdminBooking } from "@/types/admin";
import { adminService } from "@/services/admin";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError("");
        const data = await adminService.getBookings();

        console.log("bookings data:", data);

        setBookings(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Quản lý vé</h2>

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
                    <th>Người dùng</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((b, index) => (
                      <tr key={`${b.booking_id ?? "missing"}-${index}`}>
                        <td className="fw-semibold">{b.movie_title}</td>
                        <td>{b.user_name || b.email || "N/A"}</td>
                        <td>
                          {Number(b.total_price).toLocaleString("vi-VN")}đ
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              b.status === "confirmed"
                                ? "bg-success"
                                : b.status === "pending"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
                            }`}
                          >
                            {b.status === "confirmed"
                              ? "Đã xác nhận"
                              : b.status === "pending"
                                ? "Đang chờ"
                                : "Đã hủy"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        Chưa có vé nào
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
