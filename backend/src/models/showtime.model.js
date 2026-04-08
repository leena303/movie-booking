const pool = require("../config/db");

const ShowtimeModel = {
  async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        s.id,
        s.movie_id,
        s.room_id,
        s.start_time,
        s.price,
        m.title AS movie_title,
        r.name AS room_name
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.id
      JOIN rooms r ON s.room_id = r.id
      ORDER BY s.start_time ASC
    `);
    return rows;
  },

  async getByMovieId(movieId) {
    const [rows] = await pool.query(
      `
      SELECT 
        s.id,
        s.movie_id,
        s.room_id,
        s.start_time,
        s.price,
        r.name AS room_name
      FROM showtimes s
      JOIN rooms r ON s.room_id = r.id
      WHERE s.movie_id = ?
      ORDER BY s.start_time ASC
      `,
      [movieId]
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM showtimes WHERE id = ?", [id]);
    return rows[0];
  },
};

module.exports = ShowtimeModel;