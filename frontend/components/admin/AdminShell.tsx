"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../layout/Sidebar";
import { User } from "@/types/user";

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

function getClientSnapshot() {
  return true;
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const user = useMemo<User | null>(() => {
    if (!isClient) return null;

    try {
      const userStr = localStorage.getItem("user");
      return userStr ? (JSON.parse(userStr) as User) : null;
    } catch (error) {
      console.error("Read user from localStorage error:", error);
      return null;
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [isClient, user, router]);

  if (!isClient) {
    return <p className="p-4 mb-0">Đang kiểm tra quyền truy cập...</p>;
  }

  if (!user) {
    return <p className="p-4 mb-0">Đang chuyển hướng...</p>;
  }

  if (user.role !== "admin") {
    return <p className="p-4 mb-0">Đang chuyển hướng...</p>;
  }

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Sidebar />

      <main className="flex-grow-1 p-4">{children}</main>
    </div>
  );
}
