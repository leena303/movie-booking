const pool = require("../config/db");

const MovieModel = {
  async getAll(search = "", genre = "", status = "") {
    let sql = "SELECT * FROM movies WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND title LIKE ?";
      params.push(`%${search}%`);
    }

    if (genre) {
      sql += " AND genre LIKE ?";
      params.push(`%${genre}%`);
    }

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    sql += " ORDER BY id DESC";

    const [movies] = await pool.query(sql, params);
    return movies;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
    return rows[0];
  },
};

module.exports = MovieModel;
