"use client";

import { useEffect, useState } from "react";
import { bookingService } from "@/services/booking";
import { BookingHistoryItem } from "@/types/booking";
import { useAuth } from "@/hooks/useAuth";

export default function MyBookingsPage() {
  const { token, loadToken } = useAuth();
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [token]);

  if (!token) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          Bạn cần đăng nhập để xem lịch sử vé.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" />
        <p className="mt-3">Đang tải lịch sử vé...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Lịch sử đặt vé</h2>

      {!bookings.length ? (
        <div className="alert alert-info">Bạn chưa có vé nào.</div>
      ) : (
        <div className="row g-3">
          {bookings.map((item) => (
            <div key={item.booking_id} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-semibold mb-3">
                    🎬 {item.movie_title}
                  </h5>

                  <p className="mb-1">
                    <strong>Mã booking:</strong> #{item.booking_id}
                  </p>

                  <p className="mb-1">
                    <strong>Suất chiếu:</strong>{" "}
                    {new Date(item.start_time).toLocaleString("vi-VN")}
                  </p>

                  <p className="mb-1">
                    <strong>Phòng:</strong> {item.room_name}
                  </p>

                  <p className="mb-1">
                    <strong>Tổng tiền:</strong>{" "}
                    <span className="text-danger fw-semibold">
                      {Number(item.total_price).toLocaleString("vi-VN")}đ
                    </span>
                  </p>

                  <p className="mb-0">
                    <strong>Trạng thái:</strong>{" "}
                    <span
                      className={`badge ${
                        item.status === "confirmed"
                          ? "bg-success"
                          : item.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
