import { moviesService } from "@/services/movies";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ShowtimesPage({ params }: Props) {
  const { id } = await params;
  const showtimes = await moviesService.getShowtimesByMovieId(id);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold fs-3 mb-0">Danh sách suất chiếu</h1>
      </div>

      {showtimes.length === 0 ? (
        <div className="alert alert-secondary mb-0">Chưa có suất chiếu.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {showtimes.map((item) => (
            <div key={item.id} className="card border-0 shadow-sm">
              <div className="card-body">
                <p className="mb-2">
                  <span className="fw-semibold">Phòng:</span>{" "}
                  {item.room_name || "Chưa cập nhật"}
                </p>
                <p className="mb-2">
                  <span className="fw-semibold">Giờ chiếu:</span>{" "}
                  {new Date(item.start_time).toLocaleString("vi-VN")}
                </p>
                <p className="mb-0">
                  <span className="fw-semibold">Giá:</span>{" "}
                  {Number(item.price).toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
