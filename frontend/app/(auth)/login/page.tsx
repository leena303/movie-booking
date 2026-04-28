"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProtectAuth from "@/components/auth/ProtectAuth";

interface LoginFormData {
  email: string;
  password: string;
}

function AuthTabs({ active }: { active: "login" | "register" }) {
  return (
    <div className="d-flex mb-4" style={{ backgroundColor: "#e11d18" }}>
      <Link
        href="/login"
        className={`flex-fill text-center text-white fw-bold text-decoration-none py-3 ${
          active === "login" ? "border-bottom border-3 border-white" : ""
        }`}
      >
        ĐĂNG NHẬP
      </Link>

      <Link
        href="/register"
        className={`flex-fill text-center text-white fw-bold text-decoration-none py-3 ${
          active === "register" ? "border-bottom border-3 border-white" : ""
        }`}
      >
        ĐĂNG KÝ
      </Link>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Email không hợp lệ");
      return;
    }

    try {
      setLoading(true);

      const data = await login({
        email: form.email.trim(),
        password: form.password,
      });

      setSuccess("Đăng nhập thành công, đang chuyển trang...");

      const role = data.user.role?.toLowerCase();

      setTimeout(() => {
        if (role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/");
        }

        router.refresh();
      }, 500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại";

      if (
        message.toLowerCase().includes("email hoặc mật khẩu không đúng") ||
        message.toLowerCase().includes("invalid email or password")
      ) {
        setError("Email hoặc mật khẩu không đúng");
      } else {
        setError(message);
      }
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
        <div className="col-12 col-xl-10">
          <div className="row g-0 bg-white shadow-sm">
            <div className="col-lg-6 p-0">
              <AuthTabs active="login" />

              <div className="px-4 px-md-5 pb-5">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Email hoặc số điện thoại
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="form-control"
                      placeholder="Email hoặc số điện thoại"
                      style={{ height: 44 }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Mật khẩu</label>

                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => {
                          const value = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            password: value,
                          }));

                          if (!value) setShowPassword(false);
                        }}
                        className="form-control"
                        placeholder="Mật khẩu"
                        style={{ height: 44, paddingRight: 46 }}
                      />

                      {form.password && (
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary p-0 me-3"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn w-100 text-white fw-bold"
                    style={{
                      height: 48,
                      backgroundColor: "#e11d18",
                      borderRadius: 6,
                    }}
                  >
                    {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <Link
                    href="/forgot-password"
                    className="text-decoration-none"
                    style={{ color: "#0d6efd" }}
                  >
                    Bạn muốn tìm lại mật khẩu?
                  </Link>
                </div>
              </div>
            </div>

            <div
              className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center"
              style={{
                minHeight: 520,
                background: "linear-gradient(135deg, #fffaf0 0%, #fff7dc 100%)",
                borderLeft: "1px solid #ddd",
              }}
            >
              <div className="text-center px-5">
                <div style={{ fontSize: 90 }}>🎟️</div>
                <h3 className="fw-bold mt-3" style={{ color: "#999" }}>
                  CHƯƠNG TRÌNH TÍCH ĐIỂM
                </h3>
                <p className="text-muted">
                  Đăng nhập để đặt vé nhanh hơn, xem lịch sử vé và nhận thêm
                  quyền lợi thành viên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <ProtectAuth requireAuth={false}>
      <LoginForm />
    </ProtectAuth>
  );
}
