const pool = require("../config/db");

const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  async createUser(name, email, passwordHash, phone, address) {
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, address)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, passwordHash, phone || null, address || null],
    );

    return result;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, address, role, created_at
       FROM users
       WHERE id = ?`,
      [id],
    );

    return rows[0];
  },

  async findPasswordById(userId) {
    const [rows] = await pool.query(
      `SELECT id, password_hash
       FROM users
       WHERE id = ?`,
      [userId],
    );

    return rows[0];
  },

  async updateProfileById(userId, { name, phone, address }) {
    const [result] = await pool.query(
      `UPDATE users
       SET name = ?, phone = ?, address = ?
       WHERE id = ?`,
      [name, phone || null, address || null, userId],
    );

    return result;
  },

  async updatePasswordById(userId, passwordHash) {
    const [result] = await pool.query(
      `UPDATE users
       SET password_hash = ?,
           reset_password_token = NULL,
           reset_password_expires = NULL
       WHERE id = ?`,
      [passwordHash, userId],
    );

    return result;
  },

  async saveResetPasswordToken(email, token, expiresAt) {
    const [result] = await pool.query(
      `UPDATE users
       SET reset_password_token = ?, reset_password_expires = ?
       WHERE email = ?`,
      [token, expiresAt, email],
    );

    return result;
  },

  async findByResetPasswordToken(token) {
    const [rows] = await pool.query(
      `SELECT *
       FROM users
       WHERE reset_password_token = ?
       AND reset_password_expires > NOW()`,
      [token],
    );

    return rows[0];
  },
};

module.exports = UserModel;
