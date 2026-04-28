"use client";

import { useSyncExternalStore } from "react";
import { useAuth } from "@/hooks/useAuth";
import UserNavbar from "./UserNavbar";
import AdminNavbar from "./AdminNavbar";

export type StoredUser = {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string | null;
  image?: string | null;
  avatar_url?: string | null;
};

function isAdmin(user: StoredUser | null) {
  return user?.role?.toLowerCase() === "admin";
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function NavbarSkeleton() {
  return (
    <header className="border-bottom bg-light">
      <div className="container py-3" style={{ height: 70 }} />
    </header>
  );
}

export default function Navbar() {
  const isClient = useIsClient();
  const { user, token, loading, logout } = useAuth();

  if (!isClient || loading) {
    return <NavbarSkeleton />;
  }

  if (token && user && isAdmin(user)) {
    return <AdminNavbar user={user} logout={logout} />;
  }

  return <UserNavbar user={user} token={token} logout={logout} />;
}
