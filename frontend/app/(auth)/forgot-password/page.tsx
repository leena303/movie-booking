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

      // 🔥 GỌI API THẬT
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // ❗ luôn trả message giống nhau (security)
      setIsSuccess(true);
      setMessage(
        "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.",
      );
    } catch (err: unknown) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="container-fluid py-5"
      style={{ backgroundColor: "#f7f3e8", minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="bg-white shadow-sm">
            <div className="text-center text-white fw-bold py-3 bg-danger">
              QUÊN MẬT KHẨU
            </div>

            <div className="p-4 p-md-5">
              <h4 className="fw-bold mb-2">Tìm lại mật khẩu</h4>
              <p className="text-muted mb-4">
                Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
              </p>

              {message && (
                <div
                  className={`alert ${
                    isSuccess ? "alert-success" : "alert-danger"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Email<span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ height: 44 }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-danger w-100 fw-bold"
                  style={{ height: 48 }}
                >
                  {loading ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
                </button>
              </form>

              <div className="text-center mt-4">
                <Link href="/login" className="text-decoration-none">
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
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
