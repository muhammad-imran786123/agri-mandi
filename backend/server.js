// backend/server.js  — Main Entry Point
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const routes  = require('./routes/index');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors());                        // allow frontend requests
app.use(express.json());                // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ─── API ROUTES ───────────────────────────────────────────────
app.use('/api', routes);

// ─── SERVE FRONTEND ───────────────────────────────────────────
// Serve the HTML file from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// For any unknown route, send the frontend HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── 404 & ERROR HANDLERS ────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── START SERVER ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🌾  ================================');
  console.log(`🌾  Agri Mandi Server Running!`);
  console.log(`🌾  URL: http://localhost:${PORT}`);
  console.log(`🌾  API: http://localhost:${PORT}/api`);
  console.log('🌾  ================================');
  console.log('');
});
