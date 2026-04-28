"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { AdminMovie, CreateMoviePayload } from "@/types/admin";
import { adminService } from "@/services/admin";

type ModalMode = "create" | "edit" | "view" | null;

const MOVIES_PER_PAGE = 5;

const initialForm: CreateMoviePayload = {
  title: "",
  genre: "",
  duration_min: 0,
  description: "",
  poster_url: "",
  status: "coming_soon",
  release_date: "",
  director: "",
};

export default function AdminMoviesPage() {
  const router = useRouter();

  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedMovie, setSelectedMovie] = useState<AdminMovie | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateMoviePayload>(initialForm);

  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * MOVIES_PER_PAGE;
    return movies.slice(start, start + MOVIES_PER_PAGE);
  }, [movies, currentPage]);

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
      director: movie.director || "",
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

  function handleAddShowtime(movie: AdminMovie) {
    router.push(`/admin/showtimes?movieId=${movie.id}`);
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

  function formatDate(value?: string) {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("vi-VN");
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
            sizes="(max-width: 768px) 100vw, 260px"
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
      <div className="admin-page">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h2 className="mb-1 fw-bold">Quản lý phim</h2>
            <p className="text-muted mb-0">
              Quản lý danh sách phim trong hệ thống CineGo
            </p>
          </div>

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
          <div className="card border-0 shadow-sm admin-table-card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 admin-table">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 110 }}>Poster</th>
                      <th>Tên phim</th>
                      <th style={{ width: 140 }}>Ngày chiếu</th>
                      <th style={{ width: 140 }}>Trạng thái</th>
                      <th style={{ width: 150 }} className="text-center">
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedMovies.length > 0 ? (
                      paginatedMovies.map((movie) => (
                        <tr key={movie.id}>
                          <td>
                            <div style={{ width: 72 }}>
                              <PosterImage
                                src={movie.poster_url}
                                alt={movie.title}
                                height={96}
                              />
                            </div>
                          </td>

                          <td className="admin-table-title fw-semibold">
                            {movie.title}
                          </td>

                          <td>{formatDate(movie.release_date)}</td>

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
                            <div className="admin-action-group">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-info btn-icon"
                                title="Xem"
                                aria-label="Xem"
                                onClick={() => openViewModal(movie)}
                              >
                                <Eye size={16} />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary btn-icon"
                                title="Sửa"
                                aria-label="Sửa"
                                onClick={() => openEditModal(movie)}
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger btn-icon"
                                title="Xóa"
                                aria-label="Xóa"
                                onClick={() => handleDelete(movie.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          Chưa có phim nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {movies.length > 0 && (
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 px-3 py-3 border-top bg-light">
                  <div className="text-muted small">
                    Hiển thị{" "}
                    <strong>{(currentPage - 1) * MOVIES_PER_PAGE + 1}</strong> -{" "}
                    <strong>
                      {Math.min(currentPage * MOVIES_PER_PAGE, movies.length)}
                    </strong>{" "}
                    trong tổng <strong>{movies.length}</strong> phim
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Trước
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1;

                      return (
                        <button
                          key={page}
                          type="button"
                          className={`btn btn-sm ${
                            currentPage === page
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
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
            className="position-fixed top-50 start-50 translate-middle w-100 px-3 modal-custom"
            style={{
              maxWidth: 860,
              maxHeight: "90vh",
              zIndex: 1050,
            }}
          >
            <div
              className="card border-0 shadow-lg"
              onClick={(e) => e.stopPropagation()}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                maxHeight: "90vh",
              }}
            >
              <div
                className="card-body p-4"
                style={{
                  maxHeight: "90vh",
                  overflowY: "auto",
                }}
              >
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h4 className="mb-1">
                      {modalMode === "create" && "Thêm phim"}
                      {modalMode === "edit" && "Cập nhật phim"}
                      {modalMode === "view" && "Chi tiết phim"}
                    </h4>

                    {selectedMovie && (
                      <p className="text-muted small mb-0">
                        ID phim: #{selectedMovie.id}
                      </p>
                    )}
                  </div>

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
                            className="form-control form-control-sm"
                            value={selectedMovie.title || ""}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Đạo diễn</label>
                          <input
                            className="form-control form-control-sm"
                            value={selectedMovie.director || "Chưa cập nhật"}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Thể loại</label>
                          <input
                            className="form-control form-control-sm"
                            value={selectedMovie.genre || ""}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Thời lượng</label>
                          <input
                            className="form-control form-control-sm"
                            value={`${selectedMovie.duration_min || 0} phút`}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Ngày chiếu</label>
                          <input
                            className="form-control form-control-sm"
                            value={formatDate(selectedMovie.release_date)}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Trạng thái</label>
                          <input
                            className="form-control form-control-sm"
                            value={statusText(selectedMovie.status)}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label">Mô tả</label>
                          <textarea
                            className="form-control form-control-sm"
                            rows={5}
                            value={selectedMovie.description || ""}
                            readOnly
                            disabled
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-2 mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => openEditModal(selectedMovie)}
                        >
                          Chuyển sang sửa
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => handleAddShowtime(selectedMovie)}
                        >
                          Thêm suất chiếu
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
                          className="form-control form-control-sm"
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
                              className="form-control form-control-sm"
                              value={form.title}
                              onChange={(e) =>
                                handleInputChange("title", e.target.value)
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Đạo diễn</label>
                            <input
                              className="form-control form-control-sm"
                              value={form.director || ""}
                              onChange={(e) =>
                                handleInputChange("director", e.target.value)
                              }
                              placeholder="Nhập tên đạo diễn"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Thể loại</label>
                            <input
                              className="form-control form-control-sm"
                              value={form.genre}
                              onChange={(e) =>
                                handleInputChange("genre", e.target.value)
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Thời lượng</label>
                            <input
                              type="number"
                              min={1}
                              className="form-control form-control-sm"
                              value={form.duration_min}
                              onChange={(e) =>
                                handleInputChange(
                                  "duration_min",
                                  Number(e.target.value),
                                )
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Ngày chiếu</label>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              value={form.release_date}
                              onChange={(e) =>
                                handleInputChange(
                                  "release_date",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Trạng thái</label>
                            <select
                              className="form-select form-select-sm"
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
                              className="form-control form-control-sm"
                              rows={5}
                              value={form.description}
                              onChange={(e) =>
                                handleInputChange("description", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-4">
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
                            className="btn btn-outline-secondary"
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
