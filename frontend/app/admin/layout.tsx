"use client";

import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <aside
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: 260 }}
      >
        <div className="border-bottom border-secondary pb-3 mb-3">
          <h4 className="fw-bold text-danger mb-1">Admin Panel</h4>
          <p className="text-secondary small mb-0">Movie Booking</p>
        </div>

        <nav className="nav nav-pills flex-column gap-1">
          <Link href="/admin" className="nav-link text-white">
            Dashboard
          </Link>
          <Link href="/admin/users" className="nav-link text-white">
            Users
          </Link>
          <Link href="/admin/movies" className="nav-link text-white">
            Movies
          </Link>
          <Link href="/admin/showtimes" className="nav-link text-white">
            Showtimes
          </Link>
          <Link href="/admin/bookings" className="nav-link text-white">
            Bookings
          </Link>
        </nav>
      </aside>

      <div className="grow">
        <header className="bg-white border-bottom px-4 py-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Admin Dashboard</h5>
            <span className="text-muted small">Quản trị hệ thống</span>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
