"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Film,
  LayoutDashboard,
  Ticket,
  Users,
} from "lucide-react";

const SIDEBAR_WIDTH = 280;

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/movies", label: "Movies", icon: Film },
  { href: "/admin/showtimes", label: "Showtimes", icon: CalendarDays },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <section className="admin-layout">
      <aside className="admin-sidebar">
        <div className="p-3">
          <div className="admin-profile-card">
            <div className="admin-avatar">A</div>

            <div style={{ minWidth: 0 }}>
              <div className="fw-bold text-white text-truncate">
                Admin CineGo
              </div>
              <div className="small text-truncate admin-email">
                admin1@gmail.com
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
              >
                <Icon size={20} style={{ minWidth: 20 }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="admin-main">{children}</main>
    </section>
  );
}
