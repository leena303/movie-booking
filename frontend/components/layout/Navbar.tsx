"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [openMemberMenu, setOpenMemberMenu] = useState(false);

  function handleMyTickets() {
    if (!token) {
      router.push("/login");
      return;
    }
    router.push("/profile/bookings");
  }

  return (
    <header className="border-bottom bg-light">
      <div className="container d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-4">
          <Link
            href="/"
            className="fw-bold text-danger fs-4 text-decoration-none"
          >
            MovieBooking
          </Link>

          <nav className="d-flex align-items-center">
            <div className="dropdown position-relative">
              <button
                type="button"
                className="btn btn-link text-dark text-decoration-none dropdown-toggle"
                onClick={() => setOpenMemberMenu((prev) => !prev)}
              >
                Thành viên
              </button>

              {openMemberMenu && (
                <ul className="dropdown-menu show" style={{ display: "block" }}>
                  <li>
                    <Link
                      href="/members/account"
                      className="dropdown-item"
                      onClick={() => setOpenMemberMenu(false)}
                    >
                      Tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/members/benefits"
                      className="dropdown-item"
                      onClick={() => setOpenMemberMenu(false)}
                    >
                      Quyền lợi
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        </div>

        <nav className="d-flex align-items-center gap-3">
          <button
            onClick={handleMyTickets}
            className="btn btn-link text-decoration-none"
          >
            Vé của tôi
          </button>

          {token ? (
            <button
              onClick={() => {
                logout();
                alert("Đăng xuất thành công");
              }}
              className="btn btn-dark"
            >
              Đăng xuất
            </button>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline-secondary">
                Đăng nhập
              </Link>
              <Link href="/register" className="btn btn-danger">
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
