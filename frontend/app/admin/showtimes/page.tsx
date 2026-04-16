"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminMovie, AdminRoom, AdminShowtime } from "@/types/admin";
import { adminService } from "@/services/admin";

type ModalMode = "create" | "edit" | "view" | null;
type ShowtimeStatus = "all" | "upcoming" | "showing" | "ended";

type ShowtimeForm = {
  movie_id: number | "";
  room_id: number | "";
  start_time: string;
};

type ShowtimeMovieGroup = {
  movie_id: number;
  movie_title: string;
  showtimes: AdminShowtime[];
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
  const [selectedMovieGroup, setSelectedMovieGroup] =
    useState<ShowtimeMovieGroup | null>(null);
  const [form, setForm] = useState<ShowtimeForm>(initialForm);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShowtimeStatus>("all");

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

  // Chỉ giữ Phòng 1 và Phòng 2, đồng thời loại trùng tên
  const normalizedRooms = useMemo(() => {
    const seen = new Set<string>();
    const deduped = rooms.filter((room) => {
      const name = (room.name || "").trim().toLowerCase();
      if (!name) return false;
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });

    const preferred = deduped.filter((room) => {
      const name = (room.name || "").trim().toLowerCase();
      return (
        name === "phòng 1" ||
        name === "phong 1" ||
        name === "room 1" ||
        name === "phòng 2" ||
        name === "phong 2" ||
        name === "room 2"
      );
    });

    return preferred.length > 0 ? preferred : deduped.slice(0, 2);
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

    if (Number.isNaN(start.getTime())) {
      return { label: "Không xác định", value: "unknown" as const };
    }

    if (!end || now < start) {
      return { label: "Sắp chiếu", value: "upcoming" as const };
    }

    if (now >= start && now <= end) {
      return { label: "Đang chiếu", value: "showing" as const };
    }

    return { label: "Đã kết thúc", value: "ended" as const };
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
    setSelectedMovieGroup(null);
    setForm(initialForm);
    setError("");
  }

  function openCreateModal(movieId?: number) {
    setForm({
      ...initialForm,
      movie_id: movieId ?? "",
    });
    setSelectedShowtime(null);
    setSelectedMovieGroup(null);
    setModalMode("create");
    setError("");
  }

  function openViewModal(group: ShowtimeMovieGroup) {
    setSelectedMovieGroup(group);
    setSelectedShowtime(null);
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
        setSelectedShowtime(null);
      }

      if (selectedMovieGroup) {
        const nextShowtimes = selectedMovieGroup.showtimes.filter(
          (s) => s.id !== id,
        );
        if (nextShowtimes.length === 0) {
          closeModal();
        } else {
          setSelectedMovieGroup({
            ...selectedMovieGroup,
            showtimes: nextShowtimes,
          });
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể xóa lịch chiếu");
    }
  }

  function resetFilters() {
    setSearchKeyword("");
    setDateFilter("");
    setStatusFilter("all");
  }

  const filteredShowtimes = useMemo(() => {
    return showtimes.filter((item) => {
      const movieTitle =
        item.movie_title || movieMap.get(item.movie_id)?.title || "";

      const keywordMatch =
        !searchKeyword.trim() ||
        movieTitle.toLowerCase().includes(searchKeyword.trim().toLowerCase());

      const dateMatch =
        !dateFilter ||
        new Date(item.start_time).toISOString().slice(0, 10) === dateFilter;

      const status = getShowtimeStatus(item);
      const statusMatch =
        statusFilter === "all" || status.value === statusFilter;

      return keywordMatch && dateMatch && statusMatch;
    });
  }, [showtimes, movieMap, searchKeyword, dateFilter, statusFilter]);

  // Nhóm showtimes theo movie_id để ngoài bảng mỗi phim chỉ hiện 1 dòng
  const groupedMovies = useMemo<ShowtimeMovieGroup[]>(() => {
    const map = new Map<number, ShowtimeMovieGroup>();

    filteredShowtimes.forEach((item) => {
      const movieId = item.movie_id;
      const movieTitle =
        item.movie_title || movieMap.get(movieId)?.title || "N/A";

      if (!map.has(movieId)) {
        map.set(movieId, {
          movie_id: movieId,
          movie_title: movieTitle,
          showtimes: [],
        });
      }

      map.get(movieId)?.showtimes.push(item);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.movie_title.localeCompare(b.movie_title, "vi"),
    );
  }, [filteredShowtimes, movieMap]);

  return (
    <>
      <div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h2 className="mb-0">Quản lý lịch chiếu</h2>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openCreateModal()}
          >
            + Thêm lịch chiếu
          </button>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Tìm theo tên phim</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên phim..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Lọc theo ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ShowtimeStatus)
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value="upcoming">Sắp chiếu</option>
                  <option value="showing">Đang chiếu</option>
                  <option value="ended">Đã kết thúc</option>
                </select>
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={resetFilters}
                >
                  Xóa lọc
                </button>
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
                      <th>Số suất chiếu</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedMovies.length > 0 ? (
                      groupedMovies.map((group) => (
                        <tr key={group.movie_id}>
                          <td className="fw-semibold">{group.movie_title}</td>
                          <td>{group.showtimes.length}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-info"
                                onClick={() => openViewModal(group)}
                              >
                                Xem lịch chiếu
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openCreateModal(group.movie_id)}
                              >
                                Thêm suất
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-muted py-4">
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
            style={{ maxWidth: 820, zIndex: 1050 }}
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
                    {modalMode === "edit" && "Cập nhật suất chiếu"}
                    {modalMode === "view" && "Lịch chiếu của phim"}
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

                {modalMode === "view" && selectedMovieGroup && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label">Tên phim</label>
                      <input
                        className="form-control"
                        value={selectedMovieGroup.movie_title}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Danh sách suất chiếu</h6>

                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          openCreateModal(selectedMovieGroup.movie_id)
                        }
                      >
                        + Thêm suất chiếu
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-bordered align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Phòng</th>
                            <th>Bắt đầu</th>
                            <th>Kết thúc</th>
                            <th>Ghế đã đặt</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedMovieGroup.showtimes
                            .slice()
                            .sort(
                              (a, b) =>
                                new Date(a.start_time).getTime() -
                                new Date(b.start_time).getTime(),
                            )
                            .map((showtime) => (
                              <tr key={showtime.id}>
                                <td>
                                  {showtime.room_name ||
                                    roomMap.get(showtime.room_id)?.name ||
                                    "N/A"}
                                </td>
                                <td>{formatDateTime(showtime.start_time)}</td>
                                <td>
                                  {getEndTime(showtime)
                                    ? formatDateTime(
                                        getEndTime(showtime)?.toISOString(),
                                      )
                                    : "N/A"}
                                </td>
                                <td>
                                  {typeof showtime.booked_seats_count ===
                                  "number"
                                    ? showtime.booked_seats_count
                                    : "Chưa có dữ liệu"}
                                </td>
                                <td>{getShowtimeStatus(showtime).label}</td>
                                <td>
                                  <div className="d-flex gap-2 flex-wrap">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => openEditModal(showtime)}
                                    >
                                      Sửa
                                    </button>

                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDelete(showtime.id)}
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
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
                          {normalizedRooms.map((room) => (
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
                            ? "Cập nhật suất chiếu"
                            : "Thêm lịch chiếu"}
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
