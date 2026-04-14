"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminUser } from "@/types/admin";
import { UserForm } from "@/types/user";
import { adminService } from "@/services/admin";

type ModalMode = "create" | "edit" | "view" | null;

const initialForm: UserForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  role: "user",
  password: "",
  confirmPassword: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<UserForm>(initialForm);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [message, setMessage] = useState("");

  async function fetchUsers() {
    try {
      setLoading(true);
      setMessage("");
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách người dùng",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    if (modalMode) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [modalMode]);

  function openCreate() {
    setForm(initialForm);
    setSelectedUser(null);
    setMessage("");
    setModalMode("create");
  }

  function openEdit(user: AdminUser) {
    setSelectedUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "user",
      password: "",
      confirmPassword: "",
    });
    setMessage("");
    setModalMode("edit");
  }

  function openView(user: AdminUser) {
    setSelectedUser(user);
    setMessage("");
    setModalMode("view");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedUser(null);
    setForm(initialForm);
    setMessage("");
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const isError = useMemo(() => {
    const lower = message.toLowerCase();
    return (
      lower.includes("không") ||
      lower.includes("lỗi") ||
      lower.includes("thất bại") ||
      lower.includes("vui lòng") ||
      lower.includes("khớp")
    );
  }, [message]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim() || !form.email.trim()) {
      setMessage("Vui lòng nhập đầy đủ tên và email");
      return;
    }

    if (modalMode === "create") {
      if (!form.password) {
        setMessage("Vui lòng nhập mật khẩu");
        return;
      }

      if (!form.confirmPassword) {
        setMessage("Vui lòng nhập xác nhận mật khẩu");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setMessage("Mật khẩu và xác nhận mật khẩu không khớp");
        return;
      }
    }

    if (modalMode === "edit") {
      const hasPasswordInput = !!form.password || !!form.confirmPassword;

      if (hasPasswordInput) {
        if (!form.password || !form.confirmPassword) {
          setMessage(
            "Nếu đổi mật khẩu, vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu",
          );
          return;
        }

        if (form.password !== form.confirmPassword) {
          setMessage("Mật khẩu mới và xác nhận mật khẩu không khớp");
          return;
        }
      }
    }

    try {
      setSubmitting(true);

      if (modalMode === "edit" && selectedUser) {
        const payload: Partial<UserForm> = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          role: form.role,
        };

        if (form.password) {
          payload.password = form.password;
        }

        await adminService.updateUser(selectedUser.id, payload);
      } else {
        await adminService.createUser({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          role: form.role,
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
      }

      await fetchUsers();
      closeModal();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(userId: number) {
    const confirmed = window.confirm("Xóa user này?");
    if (!confirmed) return;

    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: unknown) {
      setMessage(
        err instanceof Error ? err.message : "Không thể xóa người dùng",
      );
    }
  }

  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Quản lý người dùng</h2>

          <button className="btn btn-primary" onClick={openCreate}>
            + Thêm người dùng
          </button>
        </div>

        {message && !modalMode && (
          <div
            className={`alert ${isError ? "alert-danger" : "alert-success"}`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="alert alert-secondary">Đang tải...</div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td className="fw-semibold">{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span
                              className={`badge ${
                                user.role === "admin"
                                  ? "bg-danger"
                                  : "bg-secondary"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => openView(user)}
                              >
                                Xem
                              </button>

                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openEdit(user)}
                              >
                                Sửa
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(user.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          Không có dữ liệu người dùng
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {modalMode && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              zIndex: 1040,
            }}
            onClick={closeModal}
          />

          <div
            className="position-fixed top-50 start-50 translate-middle w-100 px-3"
            style={{ maxWidth: 720, zIndex: 1050 }}
          >
            <div
              className="card border-0 shadow-lg"
              onClick={(e) => e.stopPropagation()}
              style={{ borderRadius: 16 }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">
                    {modalMode === "create" && "Thêm người dùng"}
                    {modalMode === "edit" && "Cập nhật người dùng"}
                    {modalMode === "view" && "Chi tiết người dùng"}
                  </h4>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={closeModal}
                  >
                    Đóng
                  </button>
                </div>

                {message && (
                  <div
                    className={`alert py-2 ${isError ? "alert-danger" : "alert-success"}`}
                  >
                    {message}
                  </div>
                )}

                {modalMode === "view" && selectedUser && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Tên</label>
                      <input
                        className="form-control"
                        value={selectedUser.name || "N/A"}
                        readOnly
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        value={selectedUser.email || "N/A"}
                        readOnly
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        className="form-control"
                        value={selectedUser.phone || "N/A"}
                        readOnly
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Vai trò</label>
                      <input
                        className="form-control"
                        value={selectedUser.role || "N/A"}
                        readOnly
                        disabled
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Địa chỉ</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={selectedUser.address || "N/A"}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                )}

                {(modalMode === "create" || modalMode === "edit") && (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Tên người dùng</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Nhập tên người dùng"
                          value={form.name}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Nhập email"
                          value={form.email}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Số điện thoại</label>
                        <input
                          type="text"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                          value={form.phone || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Vai trò</label>
                        <select
                          name="role"
                          value={form.role}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Địa chỉ</label>
                        <textarea
                          name="address"
                          placeholder="Nhập địa chỉ"
                          value={form.address || ""}
                          onChange={handleChange}
                          className="form-control"
                          rows={3}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          {modalMode === "edit" ? "Mật khẩu mới" : "Mật khẩu"}
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder={
                            modalMode === "edit"
                              ? "Nhập mật khẩu mới (không bắt buộc)"
                              : "Nhập mật khẩu"
                          }
                          value={form.password}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          {modalMode === "edit"
                            ? "Xác nhận mật khẩu mới"
                            : "Xác nhận mật khẩu"}
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder={
                            modalMode === "edit"
                              ? "Xác nhận mật khẩu mới"
                              : "Nhập lại mật khẩu"
                          }
                          value={form.confirmPassword || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                      >
                        {submitting
                          ? "Đang xử lý..."
                          : modalMode === "edit"
                            ? "Cập nhật"
                            : "Thêm mới"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={closeModal}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
