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
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const bookingResult = await client.query(
        `
        INSERT INTO bookings 
        (user_id, showtime_id, total_price, status, name, phone, email, payment_method, card_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
        `,
        [
          userId,
          showtimeId,
          totalPrice,
          "pending",
          name,
          phone,
          email,
          paymentMethod,
          cardNumber,
        ],
      );

      const bookingId = bookingResult.rows[0].id;

      for (const seat of seatPrices) {
        await client.query(
          `
          INSERT INTO booking_details (booking_id, seat_id, price) 
          VALUES ($1, $2, $3)
          `,
          [bookingId, seat.seatId, seat.price],
        );
      }

      await client.query("COMMIT");
      return bookingId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async getSeatsByIds(seatIds) {
    const result = await pool.query(
      `
      SELECT id, room_id, row_label, col_number, type
      FROM seats
      WHERE id = ANY($1)
      `,
      [seatIds],
    );

    return result.rows;
  },

  async getUserBookings(userId) {
    const result = await pool.query(
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
        r.name AS room_name,
        STRING_AGG(
          se.row_label || se.col_number::TEXT,
          ', ' ORDER BY se.row_label, se.col_number
        ) AS seat_names,
        CASE
          WHEN LOWER(COALESCE(b.payment_method, '')) = 'cod' AND b.status = 'confirmed' THEN 'paid'
          WHEN LOWER(COALESCE(b.payment_method, '')) = 'cod' THEN 'unpaid'
          WHEN LOWER(COALESCE(b.payment_method, '')) IN ('momo', 'vnpay') THEN 'paid'
          ELSE 'pending'
        END AS payment_status
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN rooms r ON s.room_id = r.id
      LEFT JOIN booking_details bd ON b.id = bd.booking_id
      LEFT JOIN seats se ON bd.seat_id = se.id
      WHERE b.user_id = $1
      GROUP BY 
        b.id,
        b.total_price,
        b.status,
        b.name,
        b.phone,
        b.email,
        b.payment_method,
        b.created_at,
        m.title,
        s.start_time,
        r.name
      ORDER BY b.created_at DESC
      `,
      [userId],
    );

    return result.rows;
  },

  async getBookedSeatIdsByShowtime(showtimeId) {
    const result = await pool.query(
      `
      SELECT bd.seat_id
      FROM booking_details bd
      JOIN bookings b ON bd.booking_id = b.id
      WHERE b.showtime_id = $1 AND b.status IN ('pending', 'confirmed')
      `,
      [showtimeId],
    );

    return result.rows.map((item) => item.seat_id);
  },
};

module.exports = BookingModel;

// const pool = require("../config/db");

// const BookingModel = {
//   async createBooking(
//     userId,
//     showtimeId,
//     totalPrice,
//     seatPrices,
//     name,
//     phone,
//     email,
//     paymentMethod,
//     cardNumber,
//   ) {
//     const connection = await pool.getConnection();

//     try {
//       await connection.beginTransaction();

//       const [bookingResult] = await connection.query(
//         `
//         INSERT INTO bookings
//         (user_id, showtime_id, total_price, status, name, phone, email, payment_method, card_number)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `,
//         [
//           userId,
//           showtimeId,
//           totalPrice,
//           "pending",
//           name,
//           phone,
//           email,
//           paymentMethod,
//           cardNumber,
//         ],
//       );

//       const bookingId = bookingResult.insertId;

//       for (const seat of seatPrices) {
//         await connection.query(
//           `
//           INSERT INTO booking_details (booking_id, seat_id, price)
//           VALUES (?, ?, ?)
//           `,
//           [bookingId, seat.seatId, seat.price],
//         );
//       }

//       await connection.commit();
//       return bookingId;
//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }
//   },

//   async getSeatsByIds(seatIds) {
//     const [rows] = await pool.query(
//       `
//       SELECT id, room_id, row_label, col_number, type
//       FROM seats
//       WHERE id IN (?)
//       `,
//       [seatIds],
//     );

//     return rows;
//   },

//   async getUserBookings(userId) {
//     const [rows] = await pool.query(
//       `
//       SELECT
//         b.id AS booking_id,
//         b.total_price,
//         b.status,
//         b.name,
//         b.phone,
//         b.email,
//         b.payment_method,
//         b.created_at,
//         m.title AS movie_title,
//         s.start_time,
//         r.name AS room_name,
//         GROUP_CONCAT(
//           CONCAT(se.row_label, se.col_number)
//           ORDER BY se.row_label, se.col_number
//           SEPARATOR ', '
//         ) AS seat_names,
//         CASE
//           WHEN LOWER(COALESCE(b.payment_method, '')) = 'cod' AND b.status = 'confirmed' THEN 'paid'
//           WHEN LOWER(COALESCE(b.payment_method, '')) = 'cod' THEN 'unpaid'
//           WHEN LOWER(COALESCE(b.payment_method, '')) IN ('momo', 'vnpay') THEN 'paid'
//           ELSE 'pending'
//         END AS payment_status
//       FROM bookings b
//       JOIN showtimes s ON b.showtime_id = s.id
//       JOIN movies m ON s.movie_id = m.id
//       JOIN rooms r ON s.room_id = r.id
//       LEFT JOIN booking_details bd ON b.id = bd.booking_id
//       LEFT JOIN seats se ON bd.seat_id = se.id
//       WHERE b.user_id = ?
//       GROUP BY
//         b.id,
//         b.total_price,
//         b.status,
//         b.name,
//         b.phone,
//         b.email,
//         b.payment_method,
//         b.created_at,
//         m.title,
//         s.start_time,
//         r.name
//       ORDER BY b.created_at DESC
//       `,
//       [userId],
//     );

//     return rows;
//   },

//   async getBookedSeatIdsByShowtime(showtimeId) {
//     const [rows] = await pool.query(
//       `
//       SELECT bd.seat_id
//       FROM booking_details bd
//       JOIN bookings b ON bd.booking_id = b.id
//       WHERE b.showtime_id = ? AND b.status IN ('pending', 'confirmed')
//       `,
//       [showtimeId],
//     );

//     return rows.map((item) => item.seat_id);
//   },
// };

// module.exports = BookingModel;
