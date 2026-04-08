const pool = require("../config/db");

const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  async createUser(name, email, passwordHash, phone, address) {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?)",
      [name, email, passwordHash, phone || null, address || null]
    );
    return result;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },
};

module.exports = UserModel;