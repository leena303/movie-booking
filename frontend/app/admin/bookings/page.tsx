"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminBooking, UpdateBookingStatusPayload } from "@/types/admin";
import { adminService } from "@/services/admin";

type FilterStatus = "all" | "pending" | "confirmed" | "cancelled";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(
    null,
  );

  async function fetchBookings() {
    try {
      setLoading(true);
      setError("");

      const data = await adminService.getBookings();
      const list = Array.isArray(data) ? data : [];

      list.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime(),
      );

      setBookings(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedBooking(null);
      }
    }

    if (selectedBooking) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [selectedBooking]);

  async function handleChangeStatus(
    bookingId: number,
    status: UpdateBookingStatusPayload["status"],
  ) {
    try {
      setUpdatingId(bookingId);
      setError("");

      await adminService.updateBookingStatus(bookingId, { status });

      setBookings((prev) =>
        prev.map((item) =>
          item.booking_id === bookingId ? { ...item, status } : item,
        ),
      );

      setSelectedBooking((prev) =>
        prev && prev.booking_id === bookingId ? { ...prev, status } : prev,
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Cập nhật trạng thái thất bại",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function statusText(status: string) {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  }

  function statusClass(status: string) {
    switch (status) {
      case "confirmed":
        return "bg-success";
      case "pending":
        return "bg-warning text-dark";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  }

  function paymentMethodText(method?: string) {
    switch ((method || "").toLowerCase()) {
      case "cod":
        return "Thanh toán tại rạp";
      case "momo":
        return "Momo";
      case "vnpay":
        return "VNPay";
      default:
        return "Chưa có dữ liệu";
    }
  }

  function paymentStatusText(status?: string) {
    switch ((status || "").toLowerCase()) {
      case "paid":
        return "Đã thanh toán";
      case "unpaid":
        return "Chưa thanh toán";
      case "pending":
        return "Đang chờ thanh toán";
      default:
        return "Chưa có dữ liệu";
    }
  }

  function seatText(seats?: string) {
    return seats && seats.trim() ? seats : "Chưa có dữ liệu";
  }

  function formatDateTime(value?: string) {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("vi-VN");
  }

  const filteredBookings = useMemo(() => {
    if (activeFilter === "all") return bookings;
    return bookings.filter((b) => b.status === activeFilter);
  }, [bookings, activeFilter]);

  return (
    <>
      <div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h2 className="mb-0">Quản lý vé</h2>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn btn-sm ${activeFilter === "all" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setActiveFilter("all")}
            >
              Tất cả
            </button>

            <button
              type="button"
              className={`btn btn-sm ${activeFilter === "pending" ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setActiveFilter("pending")}
            >
              Chờ xác nhận
            </button>

            <button
              type="button"
              className={`btn btn-sm ${activeFilter === "confirmed" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setActiveFilter("confirmed")}
            >
              Đã xác nhận
            </button>

            <button
              type="button"
              className={`btn btn-sm ${activeFilter === "cancelled" ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => setActiveFilter("cancelled")}
            >
              Đã hủy
            </button>
          </div>
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
                      <th>#</th>
                      <th>Phim</th>
                      <th>Người dùng</th>
                      <th>Ngày đặt</th>
                      <th>Ghế</th>
                      <th>Thanh toán</th>
                      <th>Giá</th>
                      <th>Trạng thái</th>
                      <th style={{ minWidth: 220 }}>Thao tác nhanh</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b, index) => (
                        <tr
                          key={`${b.booking_id ?? "missing"}-${b.created_at ?? "no-date"}-${index}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedBooking(b)}
                        >
                          <td>{index + 1}</td>
                          <td className="fw-semibold">
                            {b.movie_title || "N/A"}
                          </td>
                          <td>{b.user_name || b.email || "N/A"}</td>
                          <td>{formatDateTime(b.created_at)}</td>
                          <td>{seatText(b.seat_names)}</td>
                          <td>{paymentMethodText(b.payment_method)}</td>
                          <td>
                            {Number(b.total_price || 0).toLocaleString("vi-VN")}
                            đ
                          </td>
                          <td>
                            <span className={`badge ${statusClass(b.status)}`}>
                              {statusText(b.status)}
                            </span>
                          </td>

                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={
                                  updatingId === b.booking_id ||
                                  b.status === "confirmed"
                                }
                                onClick={() =>
                                  handleChangeStatus(b.booking_id, "confirmed")
                                }
                              >
                                ✔ Xác nhận
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                disabled={
                                  updatingId === b.booking_id ||
                                  b.status === "cancelled"
                                }
                                onClick={() =>
                                  handleChangeStatus(b.booking_id, "cancelled")
                                }
                              >
                                ❌ Hủy
                              </button>

                              {updatingId === b.booking_id && (
                                <span className="text-muted small align-self-center">
                                  Đang cập nhật...
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center text-muted py-4">
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

      {selectedBooking && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              zIndex: 1040,
            }}
            onClick={() => setSelectedBooking(null)}
          />

          <div
            className="position-fixed top-50 start-50 translate-middle w-100 px-3"
            style={{ maxWidth: 620, zIndex: 1050 }}
          >
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: 14,
                maxHeight: "85vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-body p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-bold">Chi tiết booking</h5>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Đóng
                  </button>
                </div>

                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label small mb-1">Phim</label>
                    <input
                      className="form-control form-control-sm"
                      value={selectedBooking.movie_title || "N/A"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">Người dùng</label>
                    <input
                      className="form-control form-control-sm"
                      value={
                        selectedBooking.user_name ||
                        selectedBooking.email ||
                        "N/A"
                      }
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">Email</label>
                    <input
                      className="form-control form-control-sm"
                      value={selectedBooking.email || "N/A"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">
                      Số điện thoại
                    </label>
                    <input
                      className="form-control form-control-sm"
                      value={selectedBooking.phone || "N/A"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">Ngày đặt vé</label>
                    <input
                      className="form-control form-control-sm"
                      value={formatDateTime(selectedBooking.created_at)}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">Suất chiếu</label>
                    <input
                      className="form-control form-control-sm"
                      value={formatDateTime(selectedBooking.start_time)}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">Phòng</label>
                    <input
                      className="form-control form-control-sm"
                      value={selectedBooking.room_name || "N/A"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">Ghế đã đặt</label>
                    <input
                      className="form-control form-control-sm"
                      value={seatText(selectedBooking.seat_names)}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">
                      Phương thức thanh toán
                    </label>
                    <input
                      className="form-control form-control-sm"
                      value={paymentMethodText(selectedBooking.payment_method)}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">
                      Trạng thái thanh toán
                    </label>
                    <input
                      className="form-control form-control-sm"
                      value={paymentStatusText(selectedBooking.payment_status)}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">Tổng tiền</label>
                    <input
                      className="form-control form-control-sm"
                      value={`${Number(selectedBooking.total_price || 0).toLocaleString("vi-VN")}đ`}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small mb-1">
                      Trạng thái booking
                    </label>
                    <input
                      className="form-control form-control-sm"
                      value={statusText(selectedBooking.status)}
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={
                      updatingId === selectedBooking.booking_id ||
                      selectedBooking.status === "confirmed"
                    }
                    onClick={() =>
                      handleChangeStatus(
                        selectedBooking.booking_id,
                        "confirmed",
                      )
                    }
                  >
                    ✔ Xác nhận
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    disabled={
                      updatingId === selectedBooking.booking_id ||
                      selectedBooking.status === "cancelled"
                    }
                    onClick={() =>
                      handleChangeStatus(
                        selectedBooking.booking_id,
                        "cancelled",
                      )
                    }
                  >
                    ❌ Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
