"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { useMemo, useState } from "react";
import type { StoredUser } from "./Navbar";

type AdminNavbarProps = {
  user: StoredUser;
  logout: () => void;
};

function getUserName(user: StoredUser) {
  return user.name || user.email || "Admin";
}

function getAvatar(user: StoredUser) {
  return user.avatar || user.avatar_url || user.image || "";
}

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() || "A";
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const userName = useMemo(() => getUserName(user), [user]);
  const avatar = useMemo(() => getAvatar(user), [user]);

  function handleToggleTheme() {
    setIsDarkMode((prev) => {
      const next = !prev;

      document.documentElement.setAttribute(
        "data-admin-theme",
        next ? "dark" : "light",
      );

      return next;
    });
  }

  function handleToggleSidebar() {
    setIsSidebarCollapsed((prev) => !prev);
    window.dispatchEvent(new Event("admin-sidebar-toggle"));
  }

  return (
    <header className="admin-topbar border-bottom shadow-sm">
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary admin-theme-btn d-inline-flex align-items-center justify-content-center"
            onClick={handleToggleSidebar}
            title={isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            aria-label={
              isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"
            }
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
            }}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={22} />
            ) : (
              <ChevronLeft size={22} />
            )}
          </button>

          <div>
            <h5 className="mb-0 fw-bold">Admin Dashboard</h5>
            <span className="small opacity-75">Movie Booking Management</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="small opacity-75 d-none d-md-inline">
            Quản trị hệ thống
          </span>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary admin-theme-btn d-inline-flex align-items-center justify-content-center"
            onClick={handleToggleTheme}
            title={
              isDarkMode ? "Chuyển sang Light mode" : "Chuyển sang Dark mode"
            }
            aria-label={
              isDarkMode ? "Chuyển sang Light mode" : "Chuyển sang Dark mode"
            }
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
            }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="btn border d-flex align-items-center gap-2 px-3 py-2 rounded-3 admin-user-btn">
            {avatar ? (
              <Image
                src={avatar}
                alt={userName}
                width={34}
                height={34}
                className="rounded-circle"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 34, height: 34 }}
              >
                {getInitial(userName)}
              </div>
            )}

            <span className="fw-semibold">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
