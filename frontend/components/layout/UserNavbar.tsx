"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { StoredUser } from "./Navbar";

type UserNavbarProps = {
  user: StoredUser | null;
  token: string | null;
  logout: () => void;
};

function getUserName(user: StoredUser | null) {
  return user?.name || user?.email || "User";
}

function getAvatar(user: StoredUser | null) {
  return user?.avatar || user?.avatar_url || user?.image || "";
}

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() || "U";
}

export default function UserNavbar({ user, token, logout }: UserNavbarProps) {
  const router = useRouter();

  const [openMemberMenu, setOpenMemberMenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const userName = useMemo(() => getUserName(user), [user]);
  const avatar = useMemo(() => getAvatar(user), [user]);

  function handleMyTickets() {
    if (!token) {
      router.push("/login");
      return;
    }

    router.push("/profile/bookings");
  }

  function handleLogout() {
    logout();
    setOpenUserMenu(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-bottom bg-light">
      <div className="container d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-4">
          <Link
            href="/"
            className="fw-bold text-danger fs-4 text-decoration-none"
          >
            CineGo
          </Link>

          <div className="dropdown position-relative">
            <button
              type="button"
              className="btn btn-link text-dark text-decoration-none fw-semibold dropdown-toggle"
              onClick={() => setOpenMemberMenu((prev) => !prev)}
            >
              Thành viên
            </button>

            {openMemberMenu && (
              <ul
                className="dropdown-menu show shadow border-0"
                style={{
                  display: "block",
                  minWidth: 180,
                  marginTop: 8,
                }}
              >
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
        </div>

        <nav className="d-flex align-items-center gap-3">
          <button
            type="button"
            onClick={handleMyTickets}
            className="btn btn-link text-decoration-none"
          >
            Vé của tôi
          </button>

          {!token || !user ? (
            <>
              <Link href="/login" className="btn btn-outline-secondary">
                Đăng nhập / Đăng ký
              </Link>
            </>
          ) : (
            <div className="dropdown position-relative">
              <button
                type="button"
                className="btn btn-light border d-flex align-items-center gap-2"
                onClick={() => setOpenUserMenu((prev) => !prev)}
              >
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={userName}
                    width={32}
                    height={32}
                    className="rounded-circle"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 32, height: 32 }}
                  >
                    {getInitial(userName)}
                  </div>
                )}

                <span className="fw-semibold">{userName}</span>
              </button>

              {openUserMenu && (
                <ul
                  className="dropdown-menu dropdown-menu-end show shadow border-0"
                  style={{
                    display: "block",
                    right: 0,
                    minWidth: 200,
                    marginTop: 8,
                  }}
                >
                  <li>
                    <Link
                      href="/profile/account"
                      className="dropdown-item"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      Thông tin tài khoản
                    </Link>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
