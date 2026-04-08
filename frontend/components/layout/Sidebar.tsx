"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-4"
      style={{ width: 250, minHeight: "100vh" }}
    >
      <h5 className="text-primary fw-bold mb-4">Admin</h5>

      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <Link href="/admin/movies" className="nav-link text-white">
            🎬 Quản lý phim
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/admin/showtimes" className="nav-link text-white">
            🕒 Lịch chiếu
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/admin/rooms" className="nav-link text-white">
            🏢 Phòng
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/admin/users" className="nav-link text-white">
            👤 Người dùng
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/admin/bookings" className="nav-link text-white">
            🎟️ Vé
          </Link>
        </li>
      </ul>
    </div>
  );
}
