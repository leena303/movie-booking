"use client";

import { Eye, EyeOff, LockKeyhole, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth";

function validatePassword(password: string) {
  if (!password.trim()) {
    return "Vui lòng nhập mật khẩu mới";
  }

  if (password.length < 8) {
    return "Mật khẩu mới phải có ít nhất 8 ký tự";
  }

  if (!/[A-Z]/.test(password)) {
    return "Mật khẩu mới phải có ít nhất 1 chữ hoa";
  }

  if (!/[a-z]/.test(password)) {
    return "Mật khẩu mới phải có ít nhất 1 chữ thường";
  }

  if (!/[0-9]/.test(password)) {
    return "Mật khẩu mới phải có ít nhất 1 số";
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]/.test(password)) {
    return "Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt";
  }

  return "";
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const { token, loading } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [loading, token, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!oldPassword.trim()) {
      setError("Vui lòng nhập mật khẩu cũ");
      return;
    }

    const passwordError = validatePassword(newPassword);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (oldPassword === newPassword) {
      setError("Mật khẩu mới không được trùng mật khẩu cũ");
      return;
    }

    try {
      setSubmitting(true);

      await authService.updateMe({
        oldPassword,
        newPassword,
      });

      setSuccess("Đổi mật khẩu thành công!");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="container py-5">
        <div className="alert alert-info">Đang tải...</div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning">
          Đang chuyển đến trang đăng nhập...
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5" style={{ maxWidth: 720 }}>
      <div
        className="rounded-4 p-4 p-md-5 mb-4 text-white"
        style={{
          background:
            "linear-gradient(135deg, #dc3545 0%, #e11d48 55%, #ff6b6b 100%)",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-white text-danger d-flex align-items-center justify-content-center"
            style={{ width: 56, height: 56 }}
          >
            <LockKeyhole size={28} />
          </div>

          <div>
            <h2 className="fw-bold mb-1">Thay đổi mật khẩu</h2>

            <p className="mb-0 opacity-75">
              Cập nhật mật khẩu mới để bảo vệ tài khoản CineGo của bạn.
            </p>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {success && <div className="alert alert-success">{success}</div>}

      <form
        onSubmit={handleSubmit}
        className="card border-0 shadow-sm rounded-4"
      >
        <div className="card-body p-4">
          <PasswordInput
            label="Mật khẩu cũ"
            value={oldPassword}
            show={showOldPassword}
            placeholder="Nhập mật khẩu cũ"
            onChange={setOldPassword}
            onToggle={() => setShowOldPassword((prev) => !prev)}
          />

          <PasswordInput
            label="Mật khẩu mới"
            value={newPassword}
            show={showNewPassword}
            placeholder="Nhập mật khẩu mới"
            onChange={setNewPassword}
            onToggle={() => setShowNewPassword((prev) => !prev)}
          />

          <PasswordInput
            label="Xác nhận mật khẩu mới"
            value={confirmPassword}
            show={showConfirmPassword}
            placeholder="Nhập lại mật khẩu mới"
            onChange={setConfirmPassword}
            onToggle={() => setShowConfirmPassword((prev) => !prev)}
          />

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => router.push("/profile/account")}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="btn btn-danger d-flex align-items-center gap-2 px-4"
              disabled={submitting}
            >
              <Save size={18} />

              {submitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

type PasswordInputProps = {
  label: string;
  value: string;
  show: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onToggle: () => void;
};

function PasswordInput({
  label,
  value,
  show,
  placeholder,
  onChange,
  onToggle,
}: PasswordInputProps) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>

      <div className="position-relative">
        <input
          type={show ? "text" : "password"}
          className="form-control"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{ paddingRight: 46 }}
        />

        {value && (
          <button
            type="button"
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary p-0 me-3"
            onClick={onToggle}
            aria-label="Toggle password visibility"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
