"use client";

import { useEffect, useState } from "react";
import { AdminUser } from "@/types/admin";
import { UserForm } from "@/types/user";
import { adminService } from "@/services/admin";

const initialForm: UserForm = {
  name: "",
  email: "",
  role: "user",
  password: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<UserForm>(initialForm);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  async function fetchUsers() {
    try {
      setLoading(true);
      setMessage("");
      const data = await adminService.getUsers();
      setUsers(data);
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEdit(user: AdminUser) {
    setEditingUserId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setMessage("");
  }

  function handleCancelEdit() {
    setEditingUserId(null);
    setForm(initialForm);
    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.email || !form.role) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!editingUserId && !form.password) {
      setMessage("Vui lòng nhập mật khẩu khi tạo user mới");
      return;
    }

    try {
      setSubmitting(true);

      if (editingUserId) {
        await adminService.updateUser(editingUserId, {
          name: form.name,
          email: form.email,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        });

        setMessage("Cập nhật người dùng thành công");
      } else {
        await adminService.createUser(form);
        setMessage("Thêm người dùng thành công");
      }

      setForm(initialForm);
      setEditingUserId(null);
      await fetchUsers();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra");
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
      setMessage("Xóa người dùng thành công");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Server error");
    }
  }

  const isError =
    message.includes("không") ||
    message.includes("lỗi") ||
    message.includes("thất bại") ||
    message.includes("Vui lòng");

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-0">Quản lý người dùng</h2>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">
            {editingUserId ? "Sửa người dùng" : "Thêm người dùng"}
          </h5>

          {message && (
            <div
              className={`alert ${isError ? "alert-danger" : "alert-success"}`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tên người dùng</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Tên người dùng"
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
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  {editingUserId ? "Mật khẩu mới" : "Mật khẩu"}
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder={
                    editingUserId ? "Mật khẩu mới (không bắt buộc)" : "Mật khẩu"
                  }
                  value={form.password}
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

              <div className="col-12 d-flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting
                    ? "Đang xử lý..."
                    : editingUserId
                      ? "Cập nhật"
                      : "Thêm mới"}
                </button>

                {editingUserId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn btn-secondary"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-muted">Đang tải dữ liệu...</div>
          ) : (
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
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="btn btn-warning btn-sm"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="btn btn-danger btn-sm"
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
          )}
        </div>
      </div>
    </div>
  );
}
