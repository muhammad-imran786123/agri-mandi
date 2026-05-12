// backend/controllers/cropsController.js
const db = require('../config/db');

// GET /api/crops — public: get all active crops with categories
async function getAll(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT c.*, cat.name AS category
       FROM crops c
       JOIN categories cat ON c.category_id = cat.id
       WHERE c.is_active = 1
       ORDER BY cat.name, c.name_en`
    );
    res.json({ success: true, crops: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch crops.' });
  }
}

// GET /api/crops/categories — public: get all categories
async function getCategories(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch categories.' });
  }
}

// POST /api/crops — admin: add new crop
async function addCrop(req, res) {
  const { name_en, name_ur, category_id, season, icon, initial_price, unit } = req.body;

  if (!name_en || !category_id) {
    return res.status(400).json({ success: false, message: 'name_en and category_id are required.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO crops (name_en, name_ur, category_id, season, icon)
       VALUES (?, ?, ?, ?, ?)`,
      [name_en, name_ur || name_en, category_id, season || 'Year-round', icon || '🌾']
    );

    // Also insert today's rate if initial price provided
    if (initial_price) {
      const today = new Date().toISOString().split('T')[0];
      await db.query(
        `INSERT INTO daily_rates (crop_id, rate_date, price, min_price, max_price, unit, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [result.insertId, today, initial_price, initial_price, initial_price, unit || 'per 40kg', req.admin.id]
      );
    }

    const [newRow] = await db.query(
      `SELECT c.*, cat.name AS category FROM crops c JOIN categories cat ON c.category_id=cat.id WHERE c.id=?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, message: 'Crop added successfully!', crop: newRow[0] });

  } catch (err) {
    console.error('addCrop error:', err);
    res.status(500).json({ success: false, message: 'Could not add crop.' });
  }
}

// PUT /api/crops/:id — admin: update crop
async function updateCrop(req, res) {
  const { name_en, name_ur, category_id, season, icon, is_active } = req.body;
  try {
    await db.query(
      `UPDATE crops SET
         name_en     = COALESCE(?, name_en),
         name_ur     = COALESCE(?, name_ur),
         category_id = COALESCE(?, category_id),
         season      = COALESCE(?, season),
         icon        = COALESCE(?, icon),
         is_active   = COALESCE(?, is_active)
       WHERE id = ?`,
      [name_en, name_ur, category_id, season, icon, is_active, req.params.id]
    );
    res.json({ success: true, message: 'Crop updated!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update crop.' });
  }
}

// DELETE /api/crops/:id — admin: soft delete (set is_active=0)
async function deleteCrop(req, res) {
  try {
    await db.query('UPDATE crops SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Crop removed from listing.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not delete crop.' });
  }
}

module.exports = { getAll, getCategories, addCrop, updateCrop, deleteCrop };
