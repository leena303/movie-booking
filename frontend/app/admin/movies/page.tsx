"use client";

import { useEffect, useState } from "react";
import { AdminMovie, CreateMoviePayload } from "@/types/admin";
import { adminService } from "@/services/admin";

const initialForm: CreateMoviePayload = {
  title: "",
  genre: "",
  duration_min: 0,
  description: "",
  poster_url: "",
  status: "coming_soon",
  release_date: "",
};

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<CreateMoviePayload>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchMovies() {
    try {
      setLoading(true);
      setError("");
      const data = await adminService.getMovies();
      setMovies(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  function handleInputChange(
    key: keyof CreateMoviePayload,
    value: string | number,
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.genre.trim() ||
      !form.release_date ||
      Number(form.duration_min) <= 0
    ) {
      setError("Vui lòng nhập đầy đủ thông tin hợp lệ");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload: CreateMoviePayload = {
        ...form,
        duration_min: Number(form.duration_min),
      };

      if (editingId) {
        await adminService.updateMovie(editingId, payload);
      } else {
        await adminService.createMovie(payload);
      }

      await fetchMovies();
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lưu phim thất bại");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(movie: AdminMovie) {
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      genre: movie.genre,
      duration_min: Number(movie.duration_min),
      description: movie.description || "",
      poster_url: movie.poster_url || "",
      status: movie.status,
      release_date: movie.release_date
        ? new Date(movie.release_date).toISOString().split("T")[0]
        : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Bạn có chắc muốn xóa phim này?");
    if (!confirmed) return;

    try {
      setError("");
      await adminService.deleteMovie(id);
      await fetchMovies();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xóa phim thất bại");
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý phim</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            {editingId ? "Cập nhật phim" : "Thêm phim mới"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tên phim</label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Thể loại</label>
                <input
                  className="form-control"
                  value={form.genre}
                  onChange={(e) => handleInputChange("genre", e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Thời lượng</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  value={form.duration_min}
                  onChange={(e) =>
                    handleInputChange("duration_min", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Ngày chiếu</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.release_date}
                  onChange={(e) =>
                    handleInputChange("release_date", e.target.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      e.target.value as "now_showing" | "coming_soon",
                    )
                  }
                >
                  <option value="coming_soon">Sắp chiếu</option>
                  <option value="now_showing">Đang chiếu</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Poster URL</label>
                <input
                  className="form-control"
                  value={form.poster_url}
                  onChange={(e) =>
                    handleInputChange("poster_url", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Mô tả</label>
                <input
                  className="form-control"
                  value={form.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Đang lưu..."
                  : editingId
                    ? "Cập nhật phim"
                    : "Thêm phim"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {loading && (
        <div className="alert alert-secondary">Đang tải dữ liệu...</div>
      )}

      {!loading && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tên phim</th>
                    <th>Thể loại</th>
                    <th>Thời lượng</th>
                    <th>Ngày chiếu</th>
                    <th>Trạng thái</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.length > 0 ? (
                    movies.map((movie) => (
                      <tr key={movie.id}>
                        <td className="fw-semibold">{movie.title}</td>
                        <td>{movie.genre}</td>
                        <td>{movie.duration_min} phút</td>
                        <td>
                          {new Date(movie.release_date).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              movie.status === "now_showing"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {movie.status === "now_showing"
                              ? "Đang chiếu"
                              : "Sắp chiếu"}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(movie)}
                            >
                              Sửa
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(movie.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        Chưa có phim nào
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
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { AdminMovie } from "@/types/admin";
// import { adminService } from "@/services/admin";

// export default function AdminMoviesPage() {
//   const [movies, setMovies] = useState<AdminMovie[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     async function fetchMovies() {
//       try {
//         setLoading(true);
//         setError("");
//         const data = await adminService.getMovies();
//         setMovies(Array.isArray(data) ? data : []);
//       } catch (err: unknown) {
//         setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchMovies();
//   }, []);

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="mb-0">Quản lý phim</h2>
//       </div>

//       {loading && (
//         <div className="alert alert-secondary">Đang tải dữ liệu...</div>
//       )}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {!loading && !error && (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Tên phim</th>
//                     <th>Thể loại</th>
//                     <th>Thời lượng</th>
//                     <th>Ngày chiếu</th>
//                     <th>Trạng thái</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {movies.length > 0 ? (
//                     movies.map((movie) => (
//                       <tr key={movie.id}>
//                         <td className="fw-semibold">{movie.title}</td>
//                         <td>{movie.genre}</td>
//                         <td>{movie.duration_min} phút</td>
//                         <td>
//                           {new Date(movie.release_date).toLocaleDateString(
//                             "vi-VN",
//                           )}
//                         </td>
//                         <td>
//                           <span
//                             className={`badge ${
//                               movie.status === "now_showing"
//                                 ? "bg-success"
//                                 : "bg-warning text-dark"
//                             }`}
//                           >
//                             {movie.status === "now_showing"
//                               ? "Đang chiếu"
//                               : "Sắp chiếu"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="text-center text-muted py-4">
//                         Chưa có phim nào
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
