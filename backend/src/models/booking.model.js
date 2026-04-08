const pool = require("../config/db");

const BookingModel = {
  async createBooking(
    userId,
    showtimeId,
    totalPrice,
    seatPrices,
    name,
    phone,
    email,
    paymentMethod,
    cardNumber,
  ) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [bookingResult] = await connection.query(
        `
        INSERT INTO bookings 
        (user_id, showtime_id, total_price, status, name, phone, email, payment_method, card_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          showtimeId,
          totalPrice,
          "confirmed",
          name,
          phone,
          email,
          paymentMethod,
          cardNumber,
        ],
      );

      const bookingId = bookingResult.insertId;

      for (const seat of seatPrices) {
        await connection.query(
          `
          INSERT INTO booking_details (booking_id, seat_id, price) 
          VALUES (?, ?, ?)
          `,
          [bookingId, seat.seatId, seat.price],
        );
      }

      await connection.commit();
      return bookingId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getSeatsByIds(seatIds) {
    const [rows] = await pool.query(
      `
      SELECT id, room_id, row_label, col_number, type
      FROM seats
      WHERE id IN (?)
      `,
      [seatIds],
    );

    return rows;
  },

  async getUserBookings(userId) {
    const [rows] = await pool.query(
      `
      SELECT 
        b.id AS booking_id,
        b.total_price,
        b.status,
        b.name,
        b.phone,
        b.email,
        b.payment_method,
        b.created_at,
        m.title AS movie_title,
        s.start_time,
        r.name AS room_name
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN rooms r ON s.room_id = r.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
      `,
      [userId],
    );

    return rows;
  },

  async getBookedSeatIdsByShowtime(showtimeId) {
    const [rows] = await pool.query(
      `
      SELECT bd.seat_id
      FROM booking_details bd
      JOIN bookings b ON bd.booking_id = b.id
      WHERE b.showtime_id = ? AND b.status IN ('pending', 'confirmed')
      `,
      [showtimeId],
    );

    return rows.map((item) => item.seat_id);
  },
};

module.exports = BookingModel;
