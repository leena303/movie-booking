"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ProtectAuth from "@/components/auth/ProtectAuth";

type Gender = "male" | "female" | "";

interface RegisterFormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  day: string;
  month: string;
  year: string;
  gender: Gender;
  area: string;
  agreed: boolean;
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

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="form-label fw-bold">
      {children}
      <span className="text-danger">*</span>
    </label>
  );
}

function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    phone: "",
    email: "",
    password: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    area: "",
    agreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function validateForm() {
    if (!form.name.trim()) return "Vui lòng nhập tên";
    if (!form.phone.trim()) return "Vui lòng nhập số điện thoại";
    if (!/^(0|\+84)[0-9]{9,10}$/.test(form.phone.trim())) {
      return "Số điện thoại không hợp lệ";
    }

    if (!form.email.trim()) return "Vui lòng nhập email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Email không hợp lệ";
    }

    if (!form.password.trim()) return "Vui lòng nhập mật khẩu";
    if (form.password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!form.day || !form.month || !form.year) {
      return "Vui lòng chọn ngày sinh";
    }

    if (!form.gender) return "Vui lòng chọn giới tính";
    if (!form.area) return "Vui lòng chọn khu vực";

    if (!form.agreed) {
      return "Vui lòng xác nhận thông tin và đồng ý điều khoản";
    }

    return "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setMessage("");

    const errorMessage = validateForm();
    if (errorMessage) {
      setMessage(errorMessage);
      return;
    }

    try {
      setLoading(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.area,
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

  const years = Array.from({ length: 70 }, (_, index) =>
    String(new Date().getFullYear() - index),
  );

  const isSuccess = message.toLowerCase().includes("thành công");

  return (
    <main
      className="container-fluid py-5"
      style={{ backgroundColor: "#f7f3e8", minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="row g-0 bg-white shadow-sm">
            <div className="col-lg-6 p-0">
              <AuthTabs active="register" />

              <div className="px-4 px-md-5 pb-5">
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
                  <div className="mb-3">
                    <RequiredLabel>Tên</RequiredLabel>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tên"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      style={{ height: 44 }}
                    />
                  </div>

                  <div className="mb-3">
                    <RequiredLabel>Số điện thoại</RequiredLabel>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Số điện thoại"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      style={{ height: 44 }}
                    />
                  </div>

                  <div className="mb-3">
                    <RequiredLabel>Email</RequiredLabel>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      style={{ height: 44 }}
                    />
                  </div>

                  <div className="mb-3">
                    <RequiredLabel>Mật khẩu</RequiredLabel>

                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={(e) => {
                          updateField("password", e.target.value);
                          if (!e.target.value) setShowPassword(false);
                        }}
                        style={{ height: 44, paddingRight: 46 }}
                      />

                      {form.password && (
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary p-0 me-3"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <RequiredLabel>Ngày sinh</RequiredLabel>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <select
                        className="form-select"
                        value={form.day}
                        onChange={(e) => updateField("day", e.target.value)}
                        style={{ width: 120, height: 44 }}
                      >
                        <option value="">Ngày</option>
                        {Array.from({ length: 31 }, (_, index) => (
                          <option key={index + 1} value={String(index + 1)}>
                            {index + 1}
                          </option>
                        ))}
                      </select>

                      <select
                        className="form-select"
                        value={form.month}
                        onChange={(e) => updateField("month", e.target.value)}
                        style={{ width: 120, height: 44 }}
                      >
                        <option value="">Tháng</option>
                        {Array.from({ length: 12 }, (_, index) => (
                          <option key={index + 1} value={String(index + 1)}>
                            {index + 1}
                          </option>
                        ))}
                      </select>

                      <select
                        className="form-select"
                        value={form.year}
                        onChange={(e) => updateField("year", e.target.value)}
                        style={{ width: 120, height: 44 }}
                      >
                        <option value="">Năm</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>

                      <span className="text-danger fw-bold">*</span>

                      <label className="d-flex align-items-center gap-1 fw-bold mb-0">
                        <input
                          type="radio"
                          name="gender"
                          checked={form.gender === "male"}
                          onChange={() => updateField("gender", "male")}
                        />
                        Nam
                      </label>

                      <label className="d-flex align-items-center gap-1 fw-bold mb-0">
                        <input
                          type="radio"
                          name="gender"
                          checked={form.gender === "female"}
                          onChange={() => updateField("gender", "female")}
                        />
                        Nữ
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <RequiredLabel>Khu vực</RequiredLabel>
                    <select
                      className="form-select"
                      value={form.area}
                      onChange={(e) => updateField("area", e.target.value)}
                      style={{ height: 44 }}
                    >
                      <option value="">Khu vực</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Phú Yên">Phú Yên</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div className="form-check my-4">
                    <input
                      type="checkbox"
                      id="agreed"
                      className="form-check-input"
                      checked={form.agreed}
                      onChange={(e) => updateField("agreed", e.target.checked)}
                    />
                    <label htmlFor="agreed" className="form-check-label ms-2">
                      Tôi xác thực thông tin đã nhập là đúng và đồng ý với{" "}
                      <Link
                        href="/terms"
                        className="fw-bold text-decoration-none"
                        style={{ color: "#e11d18" }}
                      >
                        điều khoản
                      </Link>
                    </label>
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
                    {loading ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
                  </button>
                </form>
              </div>
            </div>

            <div
              className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center"
              style={{
                minHeight: 720,
                background: "linear-gradient(135deg, #fffaf0 0%, #fff7dc 100%)",
                borderLeft: "1px solid #ddd",
              }}
            >
              <div className="text-center px-5">
                <div style={{ fontSize: 90 }}>🏷️</div>
                <h3 className="fw-bold mt-3" style={{ color: "#999" }}>
                  CHƯƠNG TRÌNH KHUYẾN MÃI
                </h3>
                <p className="text-muted">
                  Nhiều chương trình hấp dẫn dành riêng cho thành viên CineGo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <ProtectAuth requireAuth={false}>
      <RegisterForm />
    </ProtectAuth>
  );
}
