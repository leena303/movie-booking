const BookingModel = require("../models/booking.model");
const ShowtimeModel = require("../models/showtime.model");

const bookingController = {
  async createBooking(req, res) {
    try {
      const userId = req.user.id;

      if (req.user.role?.toLowerCase() === "admin") {
        return res.status(403).json({
          message: "Admin không được phép đặt vé",
        });
      }
      const {
        showtimeId,
        seatIds,
        name,
        phone,
        email,
        paymentMethod,
        cardNumber,
      } = req.body;

      if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
        return res.status(400).json({
          message: "showtimeId and seatIds are required",
        });
      }

      if (!name || !phone || !email) {
        return res.status(400).json({
          message: "Missing customer information",
        });
      }

      if (
        (paymentMethod === "momo" || paymentMethod === "vnpay") &&
        !cardNumber
      ) {
        return res.status(400).json({
          message: "Missing card number for online payment",
        });
      }

      const showtime = await ShowtimeModel.getById(showtimeId);
      if (!showtime) {
        return res.status(404).json({ message: "Showtime not found" });
      }

      const bookedSeatIds =
        await BookingModel.getBookedSeatIdsByShowtime(showtimeId);

      const hasBookedSeat = seatIds.some((seatId) =>
        bookedSeatIds.includes(seatId),
      );

      if (hasBookedSeat) {
        return res.status(400).json({
          message: "Some selected seats have already been booked",
        });
      }

      const selectedSeats = await BookingModel.getSeatsByIds(seatIds);

      if (selectedSeats.length !== seatIds.length) {
        return res.status(400).json({
          message: "Some selected seats do not exist",
        });
      }

      const invalidRoomSeat = selectedSeats.some(
        (seat) => Number(seat.room_id) !== Number(showtime.room_id),
      );

      if (invalidRoomSeat) {
        return res.status(400).json({
          message: "Some selected seats do not belong to this showtime room",
        });
      }

      const seatPrices = selectedSeats.map((seat) => {
        const price = seat.type === "vip" ? 120000 : 90000;
        return {
          seatId: seat.id,
          price,
          ...seat,
        };
      });

      const totalPrice = seatPrices.reduce((sum, s) => sum + s.price, 0);

      const bookingId = await BookingModel.createBooking(
        userId,
        Number(showtimeId),
        totalPrice,
        seatPrices,
        name,
        phone,
        email,
        paymentMethod || "cod",
        cardNumber || null,
      );

      return res.status(201).json({
        message: "Booking created successfully",
        data: {
          bookingId,
          totalPrice,
          status: "pending",
          seats: seatPrices.map((seat) => ({
            id: seat.seatId,
            seatLabel: `${seat.row_label}${seat.col_number}`,
            type: seat.type,
            price: seat.price,
          })),
        },
      });
    } catch (error) {
      console.error("Create booking error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  async getMyBookings(req, res) {
    try {
      const userId = req.user.id;
      const bookings = await BookingModel.getUserBookings(userId);

      return res.json({
        message: "Get my bookings successfully",
        data: bookings,
      });
    } catch (error) {
      console.error("Get my bookings error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
};

module.exports = bookingController;
