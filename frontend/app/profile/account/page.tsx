"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AccountPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();

  const [address, setAddress] = useState(user?.address || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const email = useMemo(() => user?.email || "", [user]);

  if (loading) {
    return (
      <main className="container py-5">
        <div className="alert alert-info">Đang tải...</div>
      </main>
    );
  }

  if (!token || !user) {
    router.replace("/login");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp");
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 1000));

      setSuccess("Cập nhật tài khoản thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Cập nhật thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: 600 }}>
      <h3 className="fw-bold mb-4">Cập nhật tài khoản</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
          />
        </div>

        <hr />

        <h6 className="fw-semibold mb-3">Đổi mật khẩu</h6>

        <div className="mb-3">
          <label className="form-label">Mật khẩu cũ</label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-danger w-100"
          disabled={submitting}
        >
          {submitting ? "Đang cập nhật..." : "Cập nhật tài khoản"}
        </button>
      </form>
    </main>
  );
}
