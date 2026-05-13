"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectAuthProps {
  children: React.ReactNode;
  requireAuth: boolean;
  redirectIfAuth?: string;
  requireAdmin?: boolean;
}

export default function ProtectAuth({
  children,
  requireAuth,
  redirectIfAuth,
  requireAdmin = false,
}: ProtectAuthProps) {
  const router = useRouter();
  const { loading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requireAdmin && isAuthenticated && user?.role !== "admin") {
      router.replace("/");
      return;
    }

    if (!requireAuth && isAuthenticated) {
      const path = redirectIfAuth ?? (user?.role === "admin" ? "/admin" : "/");
      router.replace(path);
    }
  }, [
    loading,
    isAuthenticated,
    user,
    requireAuth,
    requireAdmin,
    redirectIfAuth,
    router,
  ]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang kiểm tra...</span>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) return null;
  if (requireAdmin && isAuthenticated && user?.role !== "admin") return null;
  if (!requireAuth && isAuthenticated) return null;

  return <>{children}</>;
}
