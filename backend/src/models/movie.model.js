const pool = require("../config/db");

const MovieModel = {
  async getAll(search = "", genre = "", status = "") {
    let sql = "SELECT * FROM movies WHERE 1=1";
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND title ILIKE $${params.length}`;
    }

    if (genre) {
      params.push(`%${genre}%`);
      sql += ` AND genre ILIKE $${params.length}`;
    }

    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += " ORDER BY id DESC";

    const result = await pool.query(sql, params);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    return result.rows[0];
  },
};

module.exports = MovieModel;

// const pool = require("../config/db");

// const MovieModel = {
//   async getAll(search = "", genre = "", status = "") {
//     let sql = "SELECT * FROM movies WHERE 1=1";
//     const params = [];

//     if (search) {
//       sql += " AND title LIKE ?";
//       params.push(`%${search}%`);
//     }

//     if (genre) {
//       sql += " AND genre LIKE ?";
//       params.push(`%${genre}%`);
//     }

//     if (status) {
//       sql += " AND status = ?";
//       params.push(status);
//     }

//     sql += " ORDER BY id DESC";

//     const [movies] = await pool.query(sql, params);
//     return movies;
//   },

//   async getById(id) {
//     const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
//     return rows[0];
//   },
// };

// module.exports = MovieModel;
