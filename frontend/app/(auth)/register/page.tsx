"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, BadgeCheck, Ticket } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ProtectAuth from "@/components/auth/ProtectAuth";

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));

    if (name === "password" && !value) setShowPassword(false);
    if (name === "confirmPassword" && !value) setShowConfirmPassword(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage("Vui lòng nhập đầy đủ họ tên, email và mật khẩu");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setMessage("Email không hợp lệ");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!form.agreed) {
      setMessage("Vui lòng đồng ý với điều khoản");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        password: form.password,
      });

      setMessage("Đăng ký thành công, chuyển sang đăng nhập...");

      setTimeout(() => {
        router.replace("/login");
      }, 700);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  }

  const isSuccess = message.toLowerCase().includes("thành công");

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
                    Tạo tài khoản thật nhanh
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
                    Đăng ký tài khoản để đặt vé thuận tiện hơn, lưu lịch sử giao
                    dịch và theo dõi các bộ phim nổi bật trên hệ thống.
                  </p>
                </div>

                <div className="d-grid gap-3 mt-4">
                  <div
                    className="rounded-4 px-3 py-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <UserPlus size={18} />
                      <span
                        className="fw-semibold"
                        style={{ fontSize: "1rem" }}
                      >
                        Tạo tài khoản nhanh trong vài bước
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
                        Đặt vé và kiểm tra lịch sử dễ dàng
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-4 px-3 py-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <BadgeCheck size={18} />
                      <span
                        className="fw-semibold"
                        style={{ fontSize: "1rem" }}
                      >
                        Theo dõi phim mới và quyền lợi thành viên
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
                      <UserPlus size={28} />
                    </div>

                    <h2
                      className="fw-bold mb-2"
                      style={{ fontSize: "1.6rem", color: "#14213d" }}
                    >
                      Đăng ký tài khoản
                    </h2>

                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.92rem" }}
                    >
                      Điền thông tin để bắt đầu trải nghiệm MovieBooking
                    </p>
                  </div>

                  {message && (
                    <div
                      className={`alert ${isSuccess ? "alert-success" : "alert-danger"} rounded-4 py-2 px-3`}
                    >
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold mb-2">
                          Họ tên
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Nhập họ tên"
                          className="form-control rounded-4 border-0 shadow-none"
                          style={{
                            height: 48,
                            backgroundColor: "#eef2f7",
                            paddingLeft: 16,
                          }}
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Nhập email"
                          className="form-control rounded-4 border-0 shadow-none"
                          style={{
                            height: 48,
                            backgroundColor: "#eef2f7",
                            paddingLeft: 16,
                          }}
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                          className="form-control rounded-4 border-0 shadow-none"
                          style={{
                            height: 48,
                            backgroundColor: "#eef2f7",
                            paddingLeft: 16,
                          }}
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold mb-2">
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Nhập địa chỉ"
                          className="form-control rounded-4 border-0 shadow-none"
                          style={{
                            height: 48,
                            backgroundColor: "#eef2f7",
                            paddingLeft: 16,
                          }}
                          value={form.address}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold mb-2">
                          Mật khẩu
                        </label>
                        <div className="position-relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Nhập mật khẩu"
                            className="form-control rounded-4 border-0 shadow-none"
                            style={{
                              height: 48,
                              backgroundColor: "#eef2f7",
                              paddingLeft: 16,
                              paddingRight: form.password ? 48 : 16,
                            }}
                            value={form.password}
                            onChange={handleChange}
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

                      <div className="col-md-6">
                        <label className="form-label fw-semibold mb-2">
                          Xác nhận mật khẩu
                        </label>
                        <div className="position-relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            className="form-control rounded-4 border-0 shadow-none"
                            style={{
                              height: 48,
                              backgroundColor: "#eef2f7",
                              paddingLeft: 16,
                              paddingRight: form.confirmPassword ? 48 : 16,
                            }}
                            value={form.confirmPassword}
                            onChange={handleChange}
                          />

                          {form.confirmPassword && (
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary text-decoration-none me-3 p-0"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="col-12">
                        <div
                          className="form-check rounded-4 px-3 py-3"
                          style={{ backgroundColor: "#fff3f3" }}
                        >
                          <input
                            type="checkbox"
                            name="agreed"
                            id="agreed"
                            checked={form.agreed}
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <label
                            htmlFor="agreed"
                            className="form-check-label ms-2"
                          >
                            Tôi xác thực thông tin đã nhập là đúng và đồng ý với{" "}
                            <Link
                              href="/terms"
                              className="fw-semibold text-decoration-none"
                              style={{ color: "#d90429" }}
                            >
                              điều khoản
                            </Link>
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn w-100 text-white fw-semibold rounded-4"
                          style={{
                            height: 48,
                            backgroundColor: "#e11d48",
                            border: "none",
                          }}
                        >
                          {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                      </div>
                    </div>
                  </form>

                  <p className="text-center text-muted mt-4 mb-0">
                    Đã có tài khoản?{" "}
                    <Link
                      href="/login"
                      className="fw-semibold text-decoration-none"
                      style={{ color: "#243b64" }}
                    >
                      Đăng nhập
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

export default function RegisterPage() {
  return (
    <ProtectAuth requireAuth={false}>
      <RegisterForm />
    </ProtectAuth>
  );
}
