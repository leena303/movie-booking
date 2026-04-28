"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { AdminBooking, UpdateBookingStatusPayload } from "@/types/admin";
import { adminService } from "@/services/admin";

type FilterStatus = "all" | "pending" | "confirmed" | "cancelled";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [searchKeyword, setSearchKeyword] = useState("");
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
        return "bg-success-subtle text-success border border-success-subtle";
      case "pending":
        return "bg-warning-subtle text-warning border border-warning-subtle";
      case "cancelled":
        return "bg-danger-subtle text-danger border border-danger-subtle";
      default:
        return "bg-secondary-subtle text-secondary border border-secondary-subtle";
    }
  }

  function paymentText(method?: string) {
    switch ((method || "").toLowerCase()) {
      case "cash":
        return "Tiền mặt";
      case "cod":
        return "Tại rạp";
      case "momo":
        return "Momo";
      case "vnpay":
        return "VNPay";
      default:
        return method || "Chưa có dữ liệu";
    }
  }

  function paymentClass(method?: string) {
    const value = (method || "").toLowerCase();

    if (value === "momo" || value === "vnpay") {
      return "bg-success-subtle text-success border border-success-subtle";
    }

    if (value === "cash" || value === "cod") {
      return "bg-warning-subtle text-warning border border-warning-subtle";
    }

    return "bg-secondary-subtle text-secondary border border-secondary-subtle";
  }

  function formatDateTime(value?: string) {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("vi-VN");
  }

  function formatDate(value?: string) {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("vi-VN");
  }

  function bookingCode(id: number) {
    return `BK-${String(id).padStart(4, "0")}`;
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const statusMatch =
        activeFilter === "all" || booking.status === activeFilter;

      const keyword = searchKeyword.trim().toLowerCase();

      const keywordMatch =
        !keyword ||
        bookingCode(booking.booking_id).toLowerCase().includes(keyword) ||
        booking.movie_title?.toLowerCase().includes(keyword) ||
        booking.user_name?.toLowerCase().includes(keyword) ||
        booking.email?.toLowerCase().includes(keyword);

      return statusMatch && keywordMatch;
    });
  }, [bookings, activeFilter, searchKeyword]);

  return (
    <>
      <div className="admin-page">
        <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3 mb-4">
          <div>
            <h2 className="mb-1 fw-bold">Quản lý đặt vé</h2>
            <p className="text-muted mb-0">
              Xem và quản lý các đơn đặt vé của khách hàng
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn btn-sm px-3 ${
                activeFilter === "all" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              Tất cả
            </button>

            <button
              type="button"
              className={`btn btn-sm px-3 ${
                activeFilter === "pending"
                  ? "btn-warning"
                  : "btn-outline-warning"
              }`}
              onClick={() => setActiveFilter("pending")}
            >
              Chờ xác nhận
            </button>

            <button
              type="button"
              className={`btn btn-sm px-3 ${
                activeFilter === "confirmed"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() => setActiveFilter("confirmed")}
            >
              Đã xác nhận
            </button>

            <button
              type="button"
              className={`btn btn-sm px-3 ${
                activeFilter === "cancelled"
                  ? "btn-danger"
                  : "btn-outline-danger"
              }`}
              onClick={() => setActiveFilter("cancelled")}
            >
              Đã hủy
            </button>
          </div>
        </div>

        <div className="card border-0 shadow-sm admin-table-card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tìm kiếm booking</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm theo mã booking, tên phim, khách hàng hoặc email..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="col-md-3 d-flex align-items-end">
                {/* <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchKeyword("");
                    setActiveFilter("all");
                  }}
                >
                  Xóa bộ lọc
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="alert alert-secondary">Đang tải dữ liệu...</div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="card border-0 shadow-sm admin-table-card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 admin-table">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 130 }}>Mã booking</th>
                      <th style={{ width: 180 }}>Khách hàng</th>
                      <th>Phim</th>
                      <th style={{ width: 130 }}>Tổng tiền</th>
                      <th style={{ width: 150 }}>Trạng thái vé</th>
                      <th style={{ width: 150 }}>Thanh toán</th>
                      <th style={{ width: 130 }}>Ngày đặt</th>
                      <th style={{ width: 130 }} className="text-center">
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <tr
                          key={booking.booking_id}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <td className="fw-semibold">
                            {bookingCode(booking.booking_id)}
                          </td>

                          <td>
                            <div className="fw-semibold">
                              {booking.user_name || "N/A"}
                            </div>
                            <div className="text-muted small">
                              {booking.email || "N/A"}
                            </div>
                          </td>

                          <td className="admin-table-title fw-semibold">
                            {booking.movie_title || "N/A"}
                          </td>

                          <td className="fw-semibold text-success">
                            {Number(booking.total_price || 0).toLocaleString(
                              "vi-VN",
                            )}
                            đ
                          </td>

                          <td>
                            <span
                              className={`badge rounded-pill px-3 py-2 ${statusClass(
                                booking.status,
                              )}`}
                            >
                              {statusText(booking.status)}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge rounded-pill px-3 py-2 ${paymentClass(
                                booking.payment_method,
                              )}`}
                            >
                              {paymentText(booking.payment_method)}
                            </span>
                          </td>

                          <td>{formatDate(booking.created_at)}</td>

                          <td
                            className="text-center"
                            style={{ width: 130 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="admin-action-group">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success btn-icon"
                                title="Xác nhận"
                                aria-label="Xác nhận"
                                disabled={
                                  updatingId === booking.booking_id ||
                                  booking.status === "confirmed"
                                }
                                onClick={() =>
                                  handleChangeStatus(
                                    booking.booking_id,
                                    "confirmed",
                                  )
                                }
                              >
                                <CheckCircle size={16} />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger btn-icon"
                                title="Hủy"
                                aria-label="Hủy"
                                disabled={
                                  updatingId === booking.booking_id ||
                                  booking.status === "cancelled"
                                }
                                onClick={() =>
                                  handleChangeStatus(
                                    booking.booking_id,
                                    "cancelled",
                                  )
                                }
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-4">
                          Chưa có booking nào
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
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              zIndex: 1040,
            }}
            onClick={() => setSelectedBooking(null)}
          />

          <div
            className="position-fixed top-50 start-50 translate-middle w-100 px-3 modal-custom"
            style={{
              maxWidth: 820,
              maxHeight: "88vh",
              zIndex: 1050,
            }}
          >
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                maxHeight: "88vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="card-body p-4"
                style={{
                  maxHeight: "88vh",
                  overflowY: "auto",
                }}
              >
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h4 className="mb-1">Chi tiết booking</h4>
                    <p className="text-muted mb-0 small">
                      {bookingCode(selectedBooking.booking_id)}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Đóng
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Phim</label>
                    <input
                      className="form-control form-control-sm"
                      value={selectedBooking.movie_title || "N/A"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Khách hàng</label>
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
                    <label className="form-label">Email</label>
                    <input
                      className="form-control form-control-sm"
                      value={selectedBooking.email || "N/A"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      className="form-control form-control-sm"
                      value={selectedBooking.phone || "N/A"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Ngày đặt vé</label>
                    <input
                      className="form-control form-control-sm"
                      value={formatDateTime(selectedBooking.created_at)}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Suất chiếu</label>
                    <input
                      className="form-control form-control-sm"
                      value={formatDateTime(selectedBooking.start_time)}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phòng</label>
                    <input
                      className="form-control form-control-sm"
                      value={selectedBooking.room_name || "N/A"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Ghế đã đặt</label>
                    <input
                      className="form-control form-control-sm"
                      value={selectedBooking.seat_names || "Chưa có dữ liệu"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phương thức thanh toán</label>
                    <input
                      className="form-control form-control-sm"
                      value={paymentText(selectedBooking.payment_method)}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tổng tiền</label>
                    <input
                      className="form-control form-control-sm"
                      value={`${Number(
                        selectedBooking.total_price || 0,
                      ).toLocaleString("vi-VN")}đ`}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Trạng thái vé</label>
                    <input
                      className="form-control form-control-sm"
                      value={statusText(selectedBooking.status)}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Trạng thái thanh toán</label>
                    <input
                      className="form-control form-control-sm"
                      value={
                        selectedBooking.payment_status || "Chưa có dữ liệu"
                      }
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-success d-inline-flex align-items-center gap-2"
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
                    <CheckCircle size={16} />
                    Xác nhận
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger d-inline-flex align-items-center gap-2"
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
                    <XCircle size={16} />
                    Hủy
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
