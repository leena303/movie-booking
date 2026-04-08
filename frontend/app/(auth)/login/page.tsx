"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Ticket, Film, ShieldCheck } from "lucide-react";
import { authService } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await authService.login(form);

      setAuth(data.user, data.token);
      setSuccess("Đăng nhập thành công");

      setTimeout(() => {
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đăng nhập thất bại");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f6f2eb", minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div
            className="card border-0 shadow overflow-hidden rounded-4"
            style={{ minHeight: "620px" }}
          >
            <div className="row g-0 h-100">
              <div
                className="col-lg-6 d-none d-lg-flex flex-column justify-content-between text-white p-4 p-xl-5"
                style={{
                  background:
                    "linear-gradient(135deg, #d90429 0%, #ef233c 55%, #ff4d6d 100%)",
                  minHeight: "620px",
                }}
              >
                <div>
                  <p
                    className="text-uppercase fw-semibold mb-3"
                    style={{ letterSpacing: "0.14em", fontSize: "0.8rem" }}
                  >
                    MovieBooking
                  </p>

                  <h1
                    className="fw-bold mb-3"
                    style={{ fontSize: "2rem", lineHeight: 1.2 }}
                  >
                    Chào mừng bạn quay lại
                  </h1>

                  <p
                    className="mb-0"
                    style={{
                      fontSize: "0.98rem",
                      lineHeight: 1.7,
                      maxWidth: "480px",
                      opacity: 0.95,
                    }}
                  >
                    Đăng nhập để đặt vé nhanh hơn, xem lịch sử giao dịch và theo
                    dõi những bộ phim bạn yêu thích.
                  </p>
                </div>

                <div className="d-grid gap-3 mt-4">
                  <div
                    className="rounded-4 px-3 py-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Film size={18} />
                      <span
                        className="fw-semibold"
                        style={{ fontSize: "1rem" }}
                      >
                        Theo dõi phim đang chiếu và sắp chiếu
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-4 px-3 py-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Ticket size={18} />
                      <span
                        className="fw-semibold"
                        style={{ fontSize: "1rem" }}
                      >
                        Quản lý vé đã đặt dễ dàng
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-4 px-3 py-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <ShieldCheck size={18} />
                      <span
                        className="fw-semibold"
                        style={{ fontSize: "1rem" }}
                      >
                        Thông tin tài khoản an toàn, tiện lợi
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 d-flex align-items-center bg-white">
                <div
                  className="w-100 px-4 px-md-5 py-4 py-md-5"
                  style={{ maxWidth: 460, margin: "0 auto" }}
                >
                  <div className="text-center mb-4">
                    <div
                      className="mx-auto mb-3 rounded-4 d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: 68,
                        height: 68,
                        backgroundColor: "#f8eaea",
                        color: "#d90429",
                      }}
                    >
                      <Ticket size={28} />
                    </div>

                    <h2
                      className="fw-bold mb-2"
                      style={{ fontSize: "1.6rem", color: "#14213d" }}
                    >
                      Đăng nhập
                    </h2>

                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.92rem" }}
                    >
                      Đăng nhập để tiếp tục trải nghiệm đặt vé xem phim
                    </p>
                  </div>

                  {error && (
                    <div
                      className="alert alert-danger rounded-4 py-2 px-3"
                      style={{ fontSize: "0.92rem" }}
                    >
                      {error}
                    </div>
                  )}

                  {success && (
                    <div
                      className="alert alert-success rounded-4 py-2 px-3"
                      style={{ fontSize: "0.92rem" }}
                    >
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label
                        className="form-label fw-semibold mb-2"
                        style={{ fontSize: "0.92rem", color: "#243b64" }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Nhập email của bạn"
                        className="form-control rounded-4 border-0 shadow-none"
                        style={{
                          height: 48,
                          backgroundColor: "#eef2f7",
                          fontSize: "0.95rem",
                          paddingLeft: 16,
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="form-label fw-semibold mb-2"
                        style={{ fontSize: "0.92rem", color: "#243b64" }}
                      >
                        Mật khẩu
                      </label>

                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={form.password}
                          onChange={(e) => {
                            const value = e.target.value;
                            setForm((prev) => ({ ...prev, password: value }));
                            if (!value) setShowPassword(false);
                          }}
                          placeholder="Nhập mật khẩu"
                          className="form-control rounded-4 border-0 shadow-none"
                          style={{
                            height: 48,
                            backgroundColor: "#eef2f7",
                            fontSize: "0.95rem",
                            paddingLeft: 16,
                            paddingRight: form.password ? 48 : 16,
                          }}
                        />

                        {form.password && (
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary text-decoration-none me-3 p-0"
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
                      className="btn w-100 text-white fw-semibold rounded-4"
                      style={{
                        height: 48,
                        backgroundColor: "#e11d48",
                        border: "none",
                        fontSize: "0.95rem",
                      }}
                    >
                      {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                  </form>

                  <p
                    className="text-center text-muted mt-4 mb-0"
                    style={{ fontSize: "0.92rem" }}
                  >
                    Chưa có tài khoản?{" "}
                    <Link
                      href="/register"
                      className="fw-semibold text-decoration-none"
                      style={{ color: "#243b64" }}
                    >
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
