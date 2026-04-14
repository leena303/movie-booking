"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminMovie, AdminRoom, AdminShowtime } from "@/types/admin";
import { adminService } from "@/services/admin";

type ModalMode = "create" | "edit" | "view" | null;

type ShowtimeForm = {
  movie_id: number | "";
  room_id: number | "";
  start_time: string;
};

const initialForm: ShowtimeForm = {
  movie_id: "",
  room_id: "",
  start_time: "",
};

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<AdminShowtime[]>([]);
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [rooms, setRooms] = useState<AdminRoom[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedShowtime, setSelectedShowtime] =
    useState<AdminShowtime | null>(null);
  const [form, setForm] = useState<ShowtimeForm>(initialForm);

  const [movieFilter, setMovieFilter] = useState<string>("all");
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [showtimesData, moviesData, roomsData] = await Promise.all([
        adminService.getShowtimes(),
        adminService.getMovies(),
        adminService.getRooms(),
      ]);

      setShowtimes(Array.isArray(showtimesData) ? showtimesData : []);
      setMovies(Array.isArray(moviesData) ? moviesData : []);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
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

  const movieMap = useMemo(() => {
    return new Map(movies.map((movie) => [movie.id, movie]));
  }, [movies]);

  const roomMap = useMemo(() => {
    return new Map(rooms.map((room) => [room.id, room]));
  }, [rooms]);

  function formatDateTime(value?: string) {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("vi-VN");
  }

  function toDatetimeLocal(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  }

  function getMovieDurationMinutes(showtime: AdminShowtime) {
    return movieMap.get(showtime.movie_id)?.duration_min ?? 0;
  }

  function getEndTime(showtime: AdminShowtime) {
    const start = new Date(showtime.start_time);
    const durationMin = getMovieDurationMinutes(showtime);

    if (Number.isNaN(start.getTime()) || !durationMin) return null;

    return new Date(start.getTime() + durationMin * 60 * 1000);
  }

  function getShowtimeStatus(showtime: AdminShowtime) {
    const now = new Date();
    const start = new Date(showtime.start_time);
    const end = getEndTime(showtime);

    if (Number.isNaN(start.getTime())) return "Không xác định";
    if (!end) return "Sắp chiếu";

    if (now < start) return "Sắp chiếu";
    if (now >= start && now <= end) return "Đang chiếu";
    return "Đã kết thúc";
  }

  function handleInputChange<K extends keyof ShowtimeForm>(
    key: K,
    value: ShowtimeForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function closeModal() {
    setModalMode(null);
    setSelectedShowtime(null);
    setForm(initialForm);
    setError("");
  }

  function openCreateModal() {
    setForm(initialForm);
    setSelectedShowtime(null);
    setModalMode("create");
    setError("");
  }

  function openViewModal(item: AdminShowtime) {
    setSelectedShowtime(item);
    setModalMode("view");
    setError("");
  }

  function openEditModal(item: AdminShowtime) {
    setSelectedShowtime(item);
    setForm({
      movie_id: item.movie_id,
      room_id: item.room_id,
      start_time: toDatetimeLocal(item.start_time),
    });
    setModalMode("edit");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.movie_id || !form.room_id || !form.start_time) {
      setError("Vui lòng chọn phim, phòng và thời gian chiếu");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        movie_id: Number(form.movie_id),
        room_id: Number(form.room_id),
        start_time: new Date(form.start_time).toISOString(),
        price: 0,
      };

      if (modalMode === "edit" && selectedShowtime) {
        await adminService.updateShowtime(selectedShowtime.id, payload);
      } else {
        await adminService.createShowtime(payload);
      }

      await fetchData();
      closeModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể lưu lịch chiếu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Bạn có chắc muốn xóa lịch chiếu này?");
    if (!confirmed) return;

    try {
      setError("");
      await adminService.deleteShowtime(id);
      await fetchData();

      if (selectedShowtime?.id === id) {
        closeModal();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể xóa lịch chiếu");
    }
  }

  const filteredShowtimes = useMemo(() => {
    return showtimes.filter((item) => {
      const movieMatch =
        movieFilter === "all" || String(item.movie_id) === movieFilter;

      const roomMatch =
        roomFilter === "all" || String(item.room_id) === roomFilter;

      const dateMatch =
        !dateFilter ||
        new Date(item.start_time).toISOString().slice(0, 10) === dateFilter;

      return movieMatch && roomMatch && dateMatch;
    });
  }, [showtimes, movieFilter, roomFilter, dateFilter]);

  return (
    <>
      <div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h2 className="mb-0">Quản lý lịch chiếu</h2>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            + Thêm lịch chiếu
          </button>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Lọc theo phim</label>
                <select
                  className="form-select"
                  value={movieFilter}
                  onChange={(e) => setMovieFilter(e.target.value)}
                >
                  <option value="all">Tất cả phim</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Lọc theo phòng</label>
                <select
                  className="form-select"
                  value={roomFilter}
                  onChange={(e) => setRoomFilter(e.target.value)}
                >
                  <option value="all">Tất cả phòng</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Lọc theo ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="alert alert-secondary">Đang tải dữ liệu...</div>
        )}
        {error && !modalMode && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!loading && !error && (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Tên phim</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShowtimes.length > 0 ? (
                      filteredShowtimes.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-semibold">
                            {item.movie_title ||
                              movieMap.get(item.movie_id)?.title ||
                              "N/A"}
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-info"
                                onClick={() => openViewModal(item)}
                              >
                                Xem
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openEditModal(item)}
                              >
                                Sửa
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(item.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="text-center text-muted py-4">
                          Chưa có lịch chiếu nào
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
            style={{ maxWidth: 760, zIndex: 1050 }}
          >
            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">
                    {modalMode === "create" && "Thêm lịch chiếu"}
                    {modalMode === "edit" && "Cập nhật lịch chiếu"}
                    {modalMode === "view" && "Chi tiết lịch chiếu"}
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

                {modalMode === "view" && selectedShowtime && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Tên phim</label>
                      <input
                        className="form-control"
                        value={
                          selectedShowtime.movie_title ||
                          movieMap.get(selectedShowtime.movie_id)?.title ||
                          "N/A"
                        }
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phòng</label>
                      <input
                        className="form-control"
                        value={
                          selectedShowtime.room_name ||
                          roomMap.get(selectedShowtime.room_id)?.name ||
                          "N/A"
                        }
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Thời gian bắt đầu</label>
                      <input
                        className="form-control"
                        value={formatDateTime(selectedShowtime.start_time)}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Thời gian kết thúc</label>
                      <input
                        className="form-control"
                        value={
                          getEndTime(selectedShowtime)
                            ? formatDateTime(
                                getEndTime(selectedShowtime)?.toISOString(),
                              )
                            : "N/A"
                        }
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Số ghế đã đặt</label>
                      <input
                        className="form-control"
                        value={
                          typeof selectedShowtime.booked_seats_count ===
                          "number"
                            ? String(selectedShowtime.booked_seats_count)
                            : "Chưa có dữ liệu"
                        }
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Trạng thái suất chiếu
                      </label>
                      <input
                        className="form-control"
                        value={getShowtimeStatus(selectedShowtime)}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => openEditModal(selectedShowtime)}
                      >
                        Chuyển sang sửa
                      </button>
                    </div>
                  </div>
                )}

                {(modalMode === "create" || modalMode === "edit") && (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Chọn phim</label>
                        <select
                          className="form-select"
                          value={form.movie_id}
                          onChange={(e) =>
                            handleInputChange(
                              "movie_id",
                              e.target.value ? Number(e.target.value) : "",
                            )
                          }
                        >
                          <option value="">-- Chọn phim --</option>
                          {movies.map((movie) => (
                            <option key={movie.id} value={movie.id}>
                              {movie.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Chọn phòng</label>
                        <select
                          className="form-select"
                          value={form.room_id}
                          onChange={(e) =>
                            handleInputChange(
                              "room_id",
                              e.target.value ? Number(e.target.value) : "",
                            )
                          }
                        >
                          <option value="">-- Chọn phòng --</option>
                          {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                              {room.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Ngày giờ chiếu</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={form.start_time}
                          onChange={(e) =>
                            handleInputChange("start_time", e.target.value)
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
                            ? "Cập nhật lịch chiếu"
                            : "Thêm lịch chiếu"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
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
