"use client";

import { Seat } from "@/types/movie";

interface Props {
  seats: Seat[];
  selectedSeats: number[];
  onToggleSeat: (seatId: number) => void;
}

function groupSeatsByRow(seatArray: Seat[]) {
  const grouped = new Map<string, Seat[]>();

  seatArray.forEach((seat) => {
    const row = (seat.row_label || "").trim().toUpperCase();
    if (!row) return;

    if (!grouped.has(row)) {
      grouped.set(row, []);
    }

    grouped.get(row)?.push(seat);
  });

  return Array.from(grouped.entries())
    .sort(([rowA], [rowB]) => rowA.localeCompare(rowB, "en"))
    .map(([row, rowSeats]) => ({
      row,
      seats: rowSeats
        .slice()
        .sort((a, b) => a.col_number - b.col_number)
        .filter((seat) => seat.col_number >= 1 && seat.col_number <= 6),
    }))
    .filter((group) => group.seats.length > 0);
}

export default function SeatMap({ seats, selectedSeats, onToggleSeat }: Props) {
  const safeSeats = Array.isArray(seats) ? seats : [];

  const normalSeats = safeSeats.filter((seat) => seat.type !== "vip");
  const vipSeats = safeSeats.filter((seat) => seat.type === "vip");

  const normalRows = groupSeatsByRow(normalSeats);
  const vipRows = groupSeatsByRow(vipSeats);

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

  const renderSeatRows = (
    title: string,
    rows: { row: string; seats: Seat[] }[],
  ) => {
    if (!rows.length) return null;

    return (
      <div>
        <h6 className="fw-bold mb-2">{title}</h6>
        <div className="d-flex flex-column gap-3">
          {rows.map((rowGroup) => (
            <div key={rowGroup.row} className="row g-3">
              {rowGroup.seats.map(renderSeatButton)}
            </div>
          ))}
        </div>
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

      {renderSeatRows("Ghế thường", normalRows)}
      {renderSeatRows("Ghế VIP", vipRows)}

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
