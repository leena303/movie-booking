"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminMovie, CreateMoviePayload } from "@/types/admin";
import { adminService } from "@/services/admin";

type ModalMode = "create" | "edit" | "view" | null;

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedMovie, setSelectedMovie] = useState<AdminMovie | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateMoviePayload>(initialForm);

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

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
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

  function fillFormFromMovie(movie: AdminMovie) {
    setForm({
      title: movie.title || "",
      genre: movie.genre || "",
      duration_min: Number(movie.duration_min || 0),
      description: movie.description || "",
      poster_url: movie.poster_url || "",
      status: movie.status || "coming_soon",
      release_date: movie.release_date
        ? new Date(movie.release_date).toISOString().split("T")[0]
        : "",
    });
  }

  function handleInputChange(
    key: keyof CreateMoviePayload,
    value: string | number,
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function closeModal() {
    setModalMode(null);
    setSelectedMovie(null);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  }

  function openCreateModal() {
    setForm(initialForm);
    setSelectedMovie(null);
    setEditingId(null);
    setModalMode("create");
    setError("");
  }

  function openViewModal(movie: AdminMovie) {
    setSelectedMovie(movie);
    setModalMode("view");
    setError("");
  }

  function openEditModal(movie: AdminMovie) {
    fillFormFromMovie(movie);
    setSelectedMovie(movie);
    setEditingId(movie.id);
    setModalMode("edit");
    setError("");
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

      if (modalMode === "edit" && editingId) {
        await adminService.updateMovie(editingId, payload);
      } else {
        await adminService.createMovie(payload);
      }

      await fetchMovies();
      closeModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lưu phim thất bại");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Bạn có chắc muốn xóa phim này?");
    if (!confirmed) return;

    try {
      setError("");
      await adminService.deleteMovie(id);
      await fetchMovies();

      if (selectedMovie?.id === id) {
        closeModal();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xóa phim thất bại");
    }
  }

  function statusText(status: "now_showing" | "coming_soon") {
    return status === "now_showing" ? "Đang chiếu" : "Sắp chiếu";
  }

  function PosterImage({
    src,
    alt,
    height = 180,
  }: {
    src?: string;
    alt: string;
    height?: number;
  }) {
    const [imgError, setImgError] = useState(false);

    return (
      <div
        className="rounded border bg-light d-flex align-items-center justify-content-center overflow-hidden position-relative"
        style={{ height }}
      >
        {src && !imgError ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-fit-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
            unoptimized={
              src.startsWith("http://") || src.startsWith("https://")
            }
          />
        ) : (
          <span className="text-muted small">Chưa có poster</span>
        )}
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Quản lý phim</h2>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            + Thêm phim
          </button>
        </div>

        {error && !modalMode && (
          <div className="alert alert-danger">{error}</div>
        )}

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
                      <th>Poster</th>
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
                          <td style={{ width: 110 }}>
                            <div style={{ width: 72 }}>
                              <PosterImage
                                src={movie.poster_url}
                                alt={movie.title}
                                height={96}
                              />
                            </div>
                          </td>
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
                              {statusText(movie.status)}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-info"
                                onClick={() => openViewModal(movie)}
                              >
                                Xem
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openEditModal(movie)}
                              >
                                Sửa
                              </button>

                              <button
                                type="button"
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
                        <td colSpan={7} className="text-center text-muted py-4">
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
            style={{ maxWidth: 820, zIndex: 1050 }}
          >
            <div
              className="card border-0 shadow-lg"
              onClick={(e) => e.stopPropagation()}
              style={{ borderRadius: 16 }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">
                    {modalMode === "create" && "Thêm phim"}
                    {modalMode === "edit" && "Cập nhật phim"}
                    {modalMode === "view" && "Chi tiết phim"}
                  </h4>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={closeModal}
                  >
                    Đóng
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                {modalMode === "view" && selectedMovie && (
                  <div className="row g-4">
                    <div className="col-md-4">
                      <PosterImage
                        src={selectedMovie.poster_url}
                        alt={selectedMovie.title}
                        height={320}
                      />
                    </div>

                    <div className="col-md-8">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Tên phim</label>
                          <input
                            className="form-control"
                            value={selectedMovie.title || ""}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Thể loại</label>
                          <input
                            className="form-control"
                            value={selectedMovie.genre || ""}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">Thời lượng</label>
                          <input
                            className="form-control"
                            value={`${selectedMovie.duration_min || 0} phút`}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">Ngày chiếu</label>
                          <input
                            className="form-control"
                            value={
                              selectedMovie.release_date
                                ? new Date(
                                    selectedMovie.release_date,
                                  ).toLocaleDateString("vi-VN")
                                : ""
                            }
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">Trạng thái</label>
                          <input
                            className="form-control"
                            value={statusText(selectedMovie.status)}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label">Mô tả</label>
                          <textarea
                            className="form-control"
                            rows={6}
                            value={selectedMovie.description || ""}
                            readOnly
                            disabled
                          />
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => openEditModal(selectedMovie)}
                        >
                          Chuyển sang sửa
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(modalMode === "create" || modalMode === "edit") && (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold mb-2">
                          Poster preview
                        </label>
                        <PosterImage
                          src={form.poster_url}
                          alt={form.title || "Poster preview"}
                          height={320}
                        />

                        <label className="form-label fw-semibold mt-3">
                          Poster URL
                        </label>
                        <input
                          className="form-control"
                          value={form.poster_url}
                          onChange={(e) =>
                            handleInputChange("poster_url", e.target.value)
                          }
                          placeholder="https://..."
                        />
                      </div>

                      <div className="col-md-8">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Tên phim</label>
                            <input
                              className="form-control"
                              value={form.title}
                              onChange={(e) =>
                                handleInputChange("title", e.target.value)
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Thể loại</label>
                            <input
                              className="form-control"
                              value={form.genre}
                              onChange={(e) =>
                                handleInputChange("genre", e.target.value)
                              }
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
                                handleInputChange(
                                  "duration_min",
                                  Number(e.target.value),
                                )
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
                                handleInputChange(
                                  "release_date",
                                  e.target.value,
                                )
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
                                  e.target.value as
                                    | "now_showing"
                                    | "coming_soon",
                                )
                              }
                            >
                              <option value="coming_soon">Sắp chiếu</option>
                              <option value="now_showing">Đang chiếu</option>
                            </select>
                          </div>

                          <div className="col-12">
                            <label className="form-label">Mô tả</label>
                            <textarea
                              className="form-control"
                              rows={6}
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
                              : modalMode === "edit"
                                ? "Cập nhật phim"
                                : "Thêm phim"}
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={closeModal}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
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
