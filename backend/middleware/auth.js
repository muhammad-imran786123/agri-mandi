// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Token comes in header:  Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;   // attach admin info to request
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token. Please login again.' });
  }
}

module.exports = authMiddleware;
