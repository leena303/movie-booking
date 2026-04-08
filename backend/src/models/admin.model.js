const pool = require("../config/db");

const AdminModel = {
  // Movies
  async getAllMovies() {
    const [rows] = await pool.query("SELECT * FROM movies ORDER BY id DESC");
    return rows;
  },

  async createMovie(data) {
    const {
      title,
      genre,
      duration_min,
      description,
      poster_url,
      status,
      release_date,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO movies (title, genre, duration_min, description, poster_url, status, release_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        genre,
        duration_min,
        description,
        poster_url,
        status,
        release_date,
      ],
    );

    return result;
  },

  async updateMovie(id, data) {
    const {
      title,
      genre,
      duration_min,
      description,
      poster_url,
      status,
      release_date,
    } = data;

    const [result] = await pool.query(
      `UPDATE movies
       SET title = ?, genre = ?, duration_min = ?, description = ?, poster_url = ?, status = ?, release_date = ?
       WHERE id = ?`,
      [
        title,
        genre,
        duration_min,
        description,
        poster_url,
        status,
        release_date,
        id,
      ],
    );

    return result;
  },

  async deleteMovie(id) {
    const [result] = await pool.query("DELETE FROM movies WHERE id = ?", [id]);
    return result;
  },

  // Showtimes
  async getAllShowtimes() {
    const [rows] = await pool.query(`
      SELECT 
        s.*,
        m.title AS movie_title,
        r.name AS room_name
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.id
      JOIN rooms r ON s.room_id = r.id
      ORDER BY s.start_time DESC
    `);
    return rows;
  },

  async createShowtime(data) {
    const { movie_id, room_id, start_time, price } = data;

    const [result] = await pool.query(
      `INSERT INTO showtimes (movie_id, room_id, start_time, price)
       VALUES (?, ?, ?, ?)`,
      [movie_id, room_id, start_time, price],
    );

    return result;
  },

  async updateShowtime(id, data) {
    const { movie_id, room_id, start_time, price } = data;

    const [result] = await pool.query(
      `UPDATE showtimes
       SET movie_id = ?, room_id = ?, start_time = ?, price = ?
       WHERE id = ?`,
      [movie_id, room_id, start_time, price, id],
    );

    return result;
  },

  async deleteShowtime(id) {
    const [result] = await pool.query("DELETE FROM showtimes WHERE id = ?", [
      id,
    ]);
    return result;
  },

  // Rooms
  async getAllRooms() {
    const [rows] = await pool.query("SELECT * FROM rooms ORDER BY id DESC");
    return rows;
  },

  async createRoom(data) {
    const { name, total_rows, total_cols } = data;

    const [result] = await pool.query(
      `INSERT INTO rooms (name, total_rows, total_cols)
       VALUES (?, ?, ?)`,
      [name, total_rows, total_cols],
    );

    return result;
  },

  async updateRoom(id, data) {
    const { name, total_rows, total_cols } = data;

    const [result] = await pool.query(
      `UPDATE rooms
       SET name = ?, total_rows = ?, total_cols = ?
       WHERE id = ?`,
      [name, total_rows, total_cols, id],
    );

    return result;
  },

  async deleteRoom(id) {
    const [result] = await pool.query("DELETE FROM rooms WHERE id = ?", [id]);
    return result;
  },

  // Seats
  async getSeatsByRoom(roomId) {
    const [rows] = await pool.query(
      "SELECT * FROM seats WHERE room_id = ? ORDER BY row_label, col_number",
      [roomId],
    );
    return rows;
  },

  async createSeat(roomId, data) {
    const { row_label, col_number, type } = data;

    const [result] = await pool.query(
      `INSERT INTO seats (room_id, row_label, col_number, type)
       VALUES (?, ?, ?, ?)`,
      [roomId, row_label, col_number, type],
    );

    return result;
  },

  async updateSeat(id, data) {
    const { row_label, col_number, type } = data;

    const [result] = await pool.query(
      `UPDATE seats
       SET row_label = ?, col_number = ?, type = ?
       WHERE id = ?`,
      [row_label, col_number, type, id],
    );

    return result;
  },

  async deleteSeat(id) {
    const [result] = await pool.query("DELETE FROM seats WHERE id = ?", [id]);
    return result;
  },

  // Users
  async getAllUsers() {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, address, role, created_at FROM users ORDER BY id DESC",
    );
    return rows;
  },

  async updateUser(id, data) {
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
      fields.push("name = ?");
      values.push(data.name);
    }

    if (data.email !== undefined) {
      fields.push("email = ?");
      values.push(data.email);
    }

    if (data.phone !== undefined) {
      fields.push("phone = ?");
      values.push(data.phone);
    }

    if (data.address !== undefined) {
      fields.push("address = ?");
      values.push(data.address);
    }

    if (data.role !== undefined) {
      fields.push("role = ?");
      values.push(data.role);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    const [result] = await pool.query(sql, values);
    return result;
  },

  async createUser(data) {
    const { name, email, password, phone, address, role } = data;

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, phone, address, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password, phone || null, address || null, role || "user"],
    );

    return result;
  },
  async updateUserRole(id, role) {
    const [result] = await pool.query(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, id],
    );
    return result;
  },

  async deleteUser(id) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Xóa booking_details trước
      await connection.query(
        `
      DELETE FROM booking_details 
      WHERE booking_id IN (
        SELECT id FROM bookings WHERE user_id = ?
      )
    `,
        [id],
      );

      // 2. Xóa bookings
      await connection.query("DELETE FROM bookings WHERE user_id = ?", [id]);

      // 3. Xóa user
      const [result] = await connection.query(
        "DELETE FROM users WHERE id = ?",
        [id],
      );

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Bookings
  async getAllBookings() {
    const [rows] = await pool.query(`
      SELECT
        b.id,
        b.total_price,
        b.status,
        b.created_at,
        u.name AS user_name,
        u.email,
        m.title AS movie_title,
        s.start_time,
        r.name AS room_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN rooms r ON s.room_id = r.id
      ORDER BY b.created_at DESC
    `);
    return rows;
  },

  async updateBookingStatus(id, status) {
    const [result] = await pool.query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, id],
    );
    return result;
  },
};

module.exports = AdminModel;
