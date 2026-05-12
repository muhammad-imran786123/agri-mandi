// backend/controllers/ratesController.js
const db = require('../config/db');

// GET /api/rates — public, returns today's rates
async function getTodayRates(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM v_today_rates ORDER BY category, name_en');
    res.json({ success: true, date: new Date().toISOString().split('T')[0], rates: rows });
  } catch (err) {
    console.error('getTodayRates error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch rates.' });
  }
}

// GET /api/rates/history/:cropId — price history for a crop (last 30 days)
async function getRateHistory(req, res) {
  const { cropId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT dr.rate_date, dr.price, dr.min_price, dr.max_price, c.name_en, c.icon
       FROM daily_rates dr
       JOIN crops c ON dr.crop_id = c.id
       WHERE dr.crop_id = ?
       ORDER BY dr.rate_date DESC
       LIMIT 30`,
      [cropId]
    );
    res.json({ success: true, history: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch history.' });
  }
}

// POST /api/rates — admin: add or update today's rate for a crop
async function upsertRate(req, res) {
  const { crop_id, price, min_price, max_price, unit, remarks } = req.body;

  if (!crop_id || !price) {
    return res.status(400).json({ success: false, message: 'crop_id and price are required.' });
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    // INSERT or UPDATE (if rate for this crop today already exists)
    await db.query(
      `INSERT INTO daily_rates (crop_id, rate_date, price, min_price, max_price, unit, remarks, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         price      = VALUES(price),
         min_price  = VALUES(min_price),
         max_price  = VALUES(max_price),
         unit       = VALUES(unit),
         remarks    = VALUES(remarks),
         updated_by = VALUES(updated_by)`,
      [crop_id, today, price, min_price || price, max_price || price, unit || 'per 40kg', remarks || null, req.admin.id]
    );

    // Return updated rate
    const [updated] = await db.query('SELECT * FROM v_today_rates WHERE crop_id = ?', [crop_id]);
    res.json({ success: true, message: 'Rate updated successfully!', rate: updated[0] });

  } catch (err) {
    console.error('upsertRate error:', err);
    res.status(500).json({ success: false, message: 'Could not save rate.' });
  }
}

// DELETE /api/rates/:id — admin: remove a rate entry
async function deleteRate(req, res) {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM daily_rates WHERE id = ?', [id]);
    res.json({ success: true, message: 'Rate deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not delete rate.' });
  }
}

module.exports = { getTodayRates, getRateHistory, upsertRate, deleteRate };
