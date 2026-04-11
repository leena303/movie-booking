"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectAuthProps {
  children: React.ReactNode;
  requireAuth: boolean;
  redirectIfAuth?: string;
}

export default function ProtectAuth({
  children,
  requireAuth,
  redirectIfAuth = "/",
}: ProtectAuthProps) {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!requireAuth && isAuthenticated) {
      router.replace(redirectIfAuth);
    }
  }, [loading, isAuthenticated, requireAuth, redirectIfAuth, router]);

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
  if (!requireAuth && isAuthenticated) return null;

  return <>{children}</>;
}
