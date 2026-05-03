"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Film,
  LayoutDashboard,
  LogOut,
  Ticket,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/movies", label: "Movies", icon: Film },
  { href: "/admin/showtimes", label: "Showtimes", icon: CalendarDays },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
];

function getInitial(name?: string) {
  return name?.charAt(0)?.toUpperCase() || "A";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleToggle = () => {
      setCollapsed((prev) => !prev);
    };

    window.addEventListener("admin-sidebar-toggle", handleToggle);

    return () => {
      window.removeEventListener("admin-sidebar-toggle", handleToggle);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "admin-sidebar-collapsed",
      collapsed,
    );
  }, [collapsed]);

  function handleLogout() {
    logout();
    router.push("/login");
    router.refresh();
  }

  const adminName = user?.name || "Admin CineGo";
  const adminEmail = user?.email || "admin@gmail.com";

  return (
    <section
      className={`admin-layout ${collapsed ? "is-sidebar-collapsed" : ""}`}
    >
      <aside className="admin-sidebar">
        <div className="admin-sidebar-inner">
          <div>
            <div className="p-3">
              <div className="admin-profile-card">
                <div className="admin-avatar">{getInitial(adminName)}</div>

                <div className="admin-sidebar-text" style={{ minWidth: 0 }}>
                  <div className="fw-bold text-white text-truncate">
                    {adminName}
                  </div>
                  <div className="small text-truncate admin-email">
                    {adminEmail}
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-sidebar-divider" />

            <nav className="d-flex flex-column gap-2 px-3 pb-4">
              {adminLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-sidebar-link ${isActive ? "active" : ""}`}
                    title={item.label}
                  >
                    <Icon size={20} style={{ minWidth: 20 }} />
                    <span className="admin-sidebar-text">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-3">
            <button
              type="button"
              className="admin-logout-btn"
              onClick={handleLogout}
              title="Đăng xuất"
            >
              <LogOut size={20} style={{ minWidth: 20 }} />
              <span className="admin-sidebar-text">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </section>
  );
}
