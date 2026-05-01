"use client";

import {
  Camera,
  LinkIcon,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { User as UserType } from "@/types/user";

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() || "U";
}

type AccountFormProps = {
  currentUser: UserType;
  updateUser: (user: UserType) => void;
};

function AccountForm({ currentUser, updateUser }: AccountFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(currentUser.name || "");
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [address, setAddress] = useState(currentUser.address || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const displayName = name.trim() || currentUser.email || "User";

  function handleChooseFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarUrl(localPreviewUrl);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Vui lòng nhập họ tên");
      return;
    }

    if (phone.trim() && !/^(0|\+84)[0-9]{9,10}$/.test(phone.trim())) {
      setError("Số điện thoại không hợp lệ");
      return;
    }

    try {
      setSubmitting(true);

      const updatedUser: UserType = {
        ...currentUser,
        name: name.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        avatar: avatarUrl.trim() || null,
      };

      updateUser(updatedUser);

      setSuccess("Cập nhật tài khoản thành công!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container py-5">
      <div
        className="rounded-4 p-4 p-md-5 mb-4 text-white"
        style={{
          background:
            "linear-gradient(135deg, #dc3545 0%, #ff4d4f 45%, #a71d2a 100%)",
        }}
      >
        <h2 className="fw-bold mb-2">Thông tin tài khoản</h2>
        <p className="mb-0 opacity-75">
          Quản lý thông tin cá nhân và ảnh đại diện CineGo của bạn.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center p-4">
              <div className="d-flex justify-content-center mb-3">
                {avatarUrl ? (
                  <div
                    className="rounded-circle border border-3 border-danger shadow-sm"
                    style={{
                      width: 128,
                      height: 128,
                      backgroundImage: `url(${avatarUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                    style={{ width: 128, height: 128, fontSize: 44 }}
                  >
                    {getInitial(displayName)}
                  </div>
                )}
              </div>

              <h5 className="fw-bold mb-1">{displayName}</h5>
              <p className="text-muted small mb-4">{currentUser.email}</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleChooseFile}
              />

              <button
                type="button"
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={18} />
                Tải ảnh từ máy
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-bottom py-3 rounded-top-4">
              <h5 className="mb-0 fw-bold">Chi tiết tài khoản</h5>
            </div>

            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <User size={16} className="me-1" />
                    Họ tên
                  </label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ tên"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <Mail size={16} className="me-1" />
                    Email
                  </label>
                  <input
                    className="form-control"
                    value={currentUser.email || ""}
                    readOnly
                  />
                  <div className="form-text">Email không thể thay đổi.</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <Phone size={16} className="me-1" />
                    Số điện thoại
                  </label>
                  <input
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <MapPin size={16} className="me-1" />
                    Địa chỉ
                  </label>
                  <input
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="submit"
                  className="btn btn-danger d-flex align-items-center gap-2 px-4"
                  disabled={submitting}
                >
                  <Save size={18} />
                  {submitting ? "Đang cập nhật..." : "Cập nhật tài khoản"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, token, loading, setUser } = useAuth();

  const currentUser = useMemo(() => user, [user]);

  useEffect(() => {
    if (!loading && (!token || !currentUser)) {
      router.replace("/login");
    }
  }, [loading, token, currentUser, router]);

  if (loading) {
    return (
      <main className="container py-5">
        <div className="alert alert-info">Đang tải thông tin tài khoản...</div>
      </main>
    );
  }

  if (!token || !currentUser) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning">
          Đang chuyển đến trang đăng nhập...
        </div>
      </main>
    );
  }

  return <AccountForm currentUser={currentUser} updateUser={setUser} />;
}
