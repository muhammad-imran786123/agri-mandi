// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

// POST /api/auth/login
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    // Find admin in database
    const [rows] = await db.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const admin = rows[0];

    // Compare password with stored bcrypt hash
    const isMatch = (password === admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Generate JWT token (valid for 8 hours)
    const token = jwt.sign(
      { id: admin.id, username: admin.username, full_name: admin.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      admin: {
        id:        admin.id,
        username:  admin.username,
        full_name: admin.full_name,
        email:     admin.email,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

// GET /api/auth/me  — verify token & return admin info
async function getMe(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id, username, full_name, email, created_at FROM admin_users WHERE id = ?',
      [req.admin.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Admin not found.' });
    res.json({ success: true, admin: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = { login, getMe };
