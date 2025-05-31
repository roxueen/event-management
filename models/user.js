// models/user.js
const mysql = require('mysql2/promise');
const db = require('../src/db');

module.exports = {
  async createUser({ name, email, password, role }) {
    const conn = await db.getConnection();
    const [result] = await conn.execute(
      'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [name, email, password, role]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const conn = await db.getConnection();
    const [rows] = await conn.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }
};
