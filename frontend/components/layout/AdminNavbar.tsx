"use client";

import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { StoredUser } from "./Navbar";

type AdminNavbarProps = {
  user: StoredUser;
  logout: () => void;
};

const SIDEBAR_WIDTH = 280;

function getUserName(user: StoredUser) {
  return user.name || user.email || "Admin";
}

function getAvatar(user: StoredUser) {
  return user.avatar || user.avatar_url || user.image || "";
}

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() || "A";
}

export default function AdminNavbar({ user, logout }: AdminNavbarProps) {
  const router = useRouter();
  const [openAdminMenu, setOpenAdminMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  function handleLogout() {
    logout();
    setOpenAdminMenu(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      className="admin-topbar border-bottom shadow-sm"
      style={{
        marginLeft: SIDEBAR_WIDTH,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
      }}
    >
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <div>
          <h5 className="mb-0 fw-bold">Admin Dashboard</h5>
          <span className="small opacity-75">Movie Booking Management</span>
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

          <div className="dropdown position-relative">
            <button
              type="button"
              className="btn border d-flex align-items-center gap-2 px-3 py-2 rounded-3 admin-user-btn"
              onClick={() => setOpenAdminMenu((prev) => !prev)}
            >
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
            </button>

            {openAdminMenu && (
              <ul
                className="dropdown-menu dropdown-menu-end show shadow border-0"
                style={{
                  display: "block",
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  minWidth: 180,
                  marginTop: 8,
                  zIndex: 9999,
                }}
              >
                <li>
                  <button
                    type="button"
                    className="dropdown-item text-danger fw-semibold"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
