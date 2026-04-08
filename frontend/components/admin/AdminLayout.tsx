"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../layout/Sidebar";
import { User } from "@/types/user";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const userStr = localStorage.getItem("user");
      return userStr ? (JSON.parse(userStr) as User) : null;
    } catch (error) {
      console.error("Read user from localStorage error:", error);
      return null;
    }
  });

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) {
    return <p className="p-4 mb-0">Đang kiểm tra quyền truy cập...</p>;
  }

  if (user.role !== "admin") {
    return <p className="p-4 mb-0">Đang chuyển hướng...</p>;
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        {children}
      </div>
    </div>
  );
}
