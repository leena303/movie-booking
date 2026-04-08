const pool = require("../config/db");
const BookingModel = require("../models/booking.model");
const ShowtimeModel = require("../models/showtime.model");

const seatController = {
  async getSeatsByShowtime(req, res) {
    try {
      const { showtimeId } = req.params;

      const showtime = await ShowtimeModel.getById(showtimeId);
      if (!showtime) {
        return res.status(404).json({ message: "Showtime not found" });
      }

      const [seats] = await pool.query(
        `
        SELECT 
          s.id,
          s.room_id,
          s.row_label,
          s.col_number,
          s.type
        FROM seats s
        WHERE s.room_id = ?
        ORDER BY s.row_label ASC, s.col_number ASC
        `,
        [showtime.room_id]
      );

      const bookedSeatIds = await BookingModel.getBookedSeatIdsByShowtime(showtimeId);

      const result = seats.map((seat) => ({
        ...seat,
        is_booked: bookedSeatIds.includes(seat.id),
      }));

      return res.json({
        message: "Get seats successfully",
        data: result,
      });
    } catch (error) {
      console.error("Get seats by showtime error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = seatController;