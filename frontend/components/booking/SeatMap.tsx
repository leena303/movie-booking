"use client";

import { Seat } from "@/types/movie";

interface Props {
  seats: Seat[];
  selectedSeats: number[];
  onToggleSeat: (seatId: number) => void;
}

export default function SeatMap({ seats, selectedSeats, onToggleSeat }: Props) {
  const normalSeats = seats.filter((seat) => seat.type !== "vip");
  const vipSeats = seats.filter((seat) => seat.type === "vip");

  const chunkSeats = (seatArray: Seat[], rows: number) => {
    const result: Seat[][] = [];
    const perRow = Math.ceil(seatArray.length / rows);

    for (let i = 0; i < rows; i++) {
      result.push(seatArray.slice(i * perRow, (i + 1) * perRow));
    }

    return result;
  };

  const normalRows = chunkSeats(normalSeats, 4);
  const vipRows = chunkSeats(vipSeats, 3);

  const renderSeatButton = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);

    let buttonClass = "btn w-100 fw-semibold";

    const buttonStyle: React.CSSProperties = {
      minHeight: "48px",
      borderRadius: "10px",
      fontSize: "0.95rem",
    };

    if (seat.is_booked) {
      buttonClass += " btn-secondary";
      buttonStyle.opacity = 0.65;
      buttonStyle.cursor = "not-allowed";
    } else if (isSelected) {
      buttonClass += " btn-danger";
    } else if (seat.type === "vip") {
      buttonClass += " btn-warning";
    } else {
      buttonClass += " btn-success";
    }

    return (
      <div key={seat.id} className="col">
        <button
          type="button"
          disabled={seat.is_booked}
          onClick={() => onToggleSeat(seat.id)}
          className={buttonClass}
          style={buttonStyle}
        >
          {seat.row_label}
          {seat.col_number}
        </button>
      </div>
    );
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div
        className="text-center fw-semibold rounded py-3"
        style={{ backgroundColor: "#e9ecef", fontSize: "1rem" }}
      >
        Màn hình
      </div>

      <div>
        <h6 className="fw-bold mb-2">Ghế thường</h6>
        <div className="d-flex flex-column gap-3">
          {normalRows.map((row, index) => (
            <div key={index} className="row g-3">
              {row.map(renderSeatButton)}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h6 className="fw-bold mb-2">Ghế VIP</h6>
        <div className="d-flex flex-column gap-3">
          {vipRows.map((row, index) => (
            <div key={index} className="row g-3">
              {row.map(renderSeatButton)}
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-4 small">
        <Legend color="#198754" label="Ghế thường" />
        <Legend color="#ffc107" label="Ghế VIP" />
        <Legend color="#dc3545" label="Đang chọn" />
        <Legend color="#6c757d" label="Đã đặt" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <span
        className="d-inline-block rounded"
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: color,
        }}
      />
      {label}
    </div>
  );
}
