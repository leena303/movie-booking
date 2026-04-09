"use client";

import { useEffect, useMemo, useState } from "react";
import { moviesService } from "@/services/movies";
import SeatMap from "@/components/booking/SeatMap";
import { Seat } from "@/types/movie";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();
  const { token, loadToken } = useAuth();
  const params = useParams();
  const showtimeId = params?.showtimeId ? Number(params.showtimeId) : null;

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (!showtimeId) return;

    const fetchSeats = async () => {
      try {
        setLoading(true);

        console.log("CALL API ID:", showtimeId);

        const data = await moviesService.getSeatsByShowtimeId(
          Number(showtimeId),
        );
        setSeats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("API ERROR:", err);
        setMessage("Không tải được ghế");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [showtimeId]);

  const totalPrice = useMemo(
    () =>
      (seats || [])
        .filter((seat) => selectedSeats.includes(seat.id))
        .map((seat) => {
          return {
            id: seat.id,
            row_label: seat.row_label,
            col_number: seat.col_number,
            type: seat.type,
            price: seat.type === "vip" ? 120000 : 90000,
          };
        })
        .reduce((sum, seat) => sum + seat.price, 0),
    [seats, selectedSeats],
  );

  const chairString = useMemo(() => {
    return selectedSeats
      .map((seatId) => {
        const seat = seats.find((seat) => seat.id === seatId);
        return seat ? `${seat.row_label}${seat.col_number}` : "";
      })
      .join(", ");
  }, [seats, selectedSeats]);

  function handleToggleSeat(seatId: number) {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  }

  function handleBooking() {
    if (!token) {
      router.push("/login");
      return;
    }
    router.push(
      `/payment?showtimeId=${showtimeId}&seats=${selectedSeats.join(",")}`,
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Chọn ghế</h1>
        <p className="text-muted mb-0">Vui lòng chọn vị trí ghế bạn muốn đặt</p>
      </div>

      {loading && <div className="alert alert-secondary">Đang tải ghế...</div>}
      {message && <div className="alert alert-danger">{message}</div>}

      {!loading && (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <SeatMap
                  seats={seats}
                  selectedSeats={selectedSeats}
                  onToggleSeat={handleToggleSeat}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm sticky-top"
              style={{ top: "100px" }}
            >
              <div className="card-body">
                <h2 className="h5 fw-bold mb-3">Thông tin đặt vé</h2>

                <div className="mb-3">
                  <div className="fw-semibold mb-2">Ghế đã chọn:</div>
                  <div className="text-muted">
                    {chairString.length > 0 ? chairString : "Chưa chọn ghế"}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="fw-semibold mb-2">Tổng tiền:</div>
                  <div className="fs-5 fw-bold text-danger">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="btn btn-danger w-100"
                >
                  Xác nhận đặt vé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
