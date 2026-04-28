"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Film,
  PlusCircle,
  Ticket,
  Users,
} from "lucide-react";
import { adminService } from "@/services/admin";
import { AdminBooking } from "@/types/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    bookings: 0,
    showtimes: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    revenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        const [users, movies, bookings, showtimes] = await Promise.all([
          adminService.getUsers(),
          adminService.getMovies(),
          adminService.getBookings(),
          adminService.getShowtimes(),
        ]);

        const pendingBookings = bookings.filter(
          (item) => item.status === "pending",
        ).length;

        const confirmedBookings = bookings.filter(
          (item) => item.status === "confirmed",
        ).length;

        const cancelledBookings = bookings.filter(
          (item) => item.status === "cancelled",
        ).length;

        const revenue = bookings
          .filter((item) => item.status === "confirmed")
          .reduce((total, item) => total + Number(item.total_price || 0), 0);

        const sortedBookings = [...bookings].sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime(),
        );

        setStats({
          users: users.length,
          movies: movies.length,
          bookings: bookings.length,
          showtimes: showtimes.length,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
          revenue,
        });

        setRecentBookings(sortedBookings.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const bookingRate = useMemo(() => {
    if (stats.bookings === 0) return 0;
    return Math.round((stats.confirmedBookings / stats.bookings) * 100);
  }, [stats.bookings, stats.confirmedBookings]);

  function formatMoney(value: number) {
    return `${value.toLocaleString("vi-VN")}đ`;
  }

  function formatDate(value?: string) {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("vi-VN");
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
        return "bg-success-subtle text-success";
      case "pending":
        return "bg-warning-subtle text-warning";
      case "cancelled":
        return "bg-danger-subtle text-danger";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  }

  return (
    <div className="admin-page">
      <div className="dashboard-hero mb-4">
        <div>
          <p className="text-uppercase small fw-bold mb-2 opacity-75">
            CineGo Admin
          </p>
          <h2 className="fw-bold mb-2">Dashboard</h2>
          <p className="mb-0 opacity-75">
            Tổng quan hoạt động của hệ thống đặt vé xem phim.
          </p>
        </div>

        <div className="text-end d-none d-md-block">
          <p className="mb-1 small opacity-75">Completion rate</p>
          <h3 className="fw-bold mb-0">{bookingRate}%</h3>
        </div>
      </div>

      {loading ? (
        <div className="alert alert-secondary">Đang tải dashboard...</div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <StatCard
              title="Users"
              value={stats.users}
              icon={<Users size={22} />}
              color="primary"
              note="Tài khoản hệ thống"
            />

            <StatCard
              title="Movies"
              value={stats.movies}
              icon={<Film size={22} />}
              color="success"
              note="Phim đang quản lý"
            />

            <StatCard
              title="Showtimes"
              value={stats.showtimes}
              icon={<CalendarDays size={22} />}
              color="warning"
              note="Suất chiếu hiện có"
            />

            <StatCard
              title="Bookings"
              value={stats.bookings}
              icon={<Ticket size={22} />}
              color="danger"
              note="Tổng số vé đã đặt"
            />
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">Booking Overview</h5>
                      <p className="text-muted mb-0 small">
                        Tình trạng xử lý vé hiện tại
                      </p>
                    </div>

                    <Link
                      href="/admin/bookings"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Xem tất cả
                    </Link>
                  </div>

                  <div className="row g-3">
                    <StatusBox
                      label="Chờ xác nhận"
                      value={stats.pendingBookings}
                      icon={<Clock size={20} />}
                      className="bg-warning-subtle text-warning"
                    />

                    <StatusBox
                      label="Đã xác nhận"
                      value={stats.confirmedBookings}
                      icon={<CheckCircle size={20} />}
                      className="bg-success-subtle text-success"
                    />

                    <StatusBox
                      label="Đã hủy"
                      value={stats.cancelledBookings}
                      icon={<Ticket size={20} />}
                      className="bg-danger-subtle text-danger"
                    />
                  </div>

                  <div className="mt-4">
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-muted">Confirmed rate</span>
                      <span className="fw-bold">{bookingRate}%</span>
                    </div>
                    <div
                      className="progress"
                      style={{ height: 10, borderRadius: 999 }}
                    >
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${bookingRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-1">Revenue</h5>
                  <p className="text-muted small mb-4">
                    Doanh thu từ booking đã xác nhận
                  </p>

                  <h2 className="fw-bold text-success mb-3">
                    {formatMoney(stats.revenue)}
                  </h2>

                  <div className="revenue-note rounded-4 p-4 bg-light">
                    <p className="text-muted mb-0">Creative idea</p>
                    <p className="mb-0">
                      Có thể bổ sung biểu đồ doanh thu theo tháng sau này.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Recent Bookings</h5>
                    <Link
                      href="/admin/bookings"
                      className="btn btn-sm btn-outline-dark"
                    >
                      Manage
                    </Link>
                  </div>

                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Khách hàng</th>
                          <th>Phim</th>
                          <th>Ngày đặt</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentBookings.length > 0 ? (
                          recentBookings.map((booking) => (
                            <tr key={booking.booking_id}>
                              <td>
                                <div className="fw-semibold">
                                  {booking.user_name || "N/A"}
                                </div>
                                <div className="small text-muted">
                                  {booking.email || "N/A"}
                                </div>
                              </td>

                              <td className="fw-semibold">
                                {booking.movie_title || "N/A"}
                              </td>

                              <td>{formatDate(booking.created_at)}</td>

                              <td>
                                <span
                                  className={`badge rounded-pill px-3 py-2 ${statusClass(
                                    booking.status,
                                  )}`}
                                >
                                  {statusText(booking.status)}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center text-muted py-4"
                            >
                              Chưa có booking nào
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Quick Actions</h5>

                  <div className="d-grid gap-2">
                    <Link
                      href="/admin/movies"
                      className="btn btn-outline-primary d-flex align-items-center justify-content-between"
                    >
                      <span>Thêm / quản lý phim</span>
                      <PlusCircle size={18} />
                    </Link>

                    <Link
                      href="/admin/showtimes"
                      className="btn btn-outline-success d-flex align-items-center justify-content-between"
                    >
                      <span>Tạo lịch chiếu</span>
                      <CalendarDays size={18} />
                    </Link>

                    <Link
                      href="/admin/bookings"
                      className="btn btn-outline-danger d-flex align-items-center justify-content-between"
                    >
                      <span>Xử lý booking</span>
                      <Ticket size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  note,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "danger";
  note: string;
}) {
  return (
    <div className="col-md-6 col-xl-3">
      <div className="card border-0 shadow-sm h-100 dashboard-stat-card">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <p className="text-muted mb-1">{title}</p>
              <h3 className={`fw-bold mb-0 text-${color}`}>{value}</h3>
            </div>

            <div className={`dashboard-icon bg-${color}-subtle text-${color}`}>
              {icon}
            </div>
          </div>

          <p className="small text-muted mb-0">{note}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBox({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <div className="col-md-4">
      <div className={`rounded-4 p-3 ${className}`}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="small opacity-75">{label}</div>
            <div className="fs-4 fw-bold">{value}</div>
          </div>

          {icon}
        </div>
      </div>
    </div>
  );
}
