"use client";

import { useState } from "react";
import Link from "next/link";
import ProtectAuth from "@/components/auth/ProtectAuth";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!email.trim()) {
      setMessage("Vui lòng nhập email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Email không hợp lệ");
      return;
    }

    try {
      setLoading(true);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      setIsSuccess(true);
      setMessage(
        "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.",
      );
    } catch {
      setMessage("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div
        className="auth-card"
        style={{
          maxWidth: 520,
          minHeight: "auto",
          borderRadius: 26,
        }}
      >
        <div className="p-4 p-md-5">
          <div className="auth-title-block text-center">
            <h1 className="auth-title" style={{ fontSize: "2rem" }}>
              Quên mật khẩu
            </h1>

            <p className="auth-subtitle">
              Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
            </p>
          </div>

          {message && (
            <div
              className={`alert py-2 ${
                isSuccess ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email <span className="text-danger">*</span>
              </label>

              <input
                type="email"
                className="form-control auth-input"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn auth-submit w-100 mt-2"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Quay lại </span>
            <Link
              href="/login"
              className="auth-link fw-bold text-decoration-underline"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <ProtectAuth requireAuth={false}>
      <ForgotPasswordForm />
    </ProtectAuth>
  );
}
