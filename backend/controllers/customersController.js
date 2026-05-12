// backend/controllers/customersController.js
const db = require('../config/db');

// GET /api/customers — admin: get all customers (with search & filter)
async function getAll(req, res) {
  const { search, status, type } = req.query;

  let sql    = 'SELECT * FROM customers WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (full_name LIKE ? OR phone LIKE ? OR city LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (type)   { sql += ' AND type = ?';   params.push(type);   }

  sql += ' ORDER BY created_at DESC';

  try {
    const [rows] = await db.query(sql, params);
    res.json({ success: true, total: rows.length, customers: rows });
  } catch (err) {
    console.error('getAll customers error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch customers.' });
  }
}

// GET /api/customers/:id — admin: get single customer
async function getOne(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Customer not found.' });
    res.json({ success: true, customer: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// POST /api/customers — admin: add new customer
async function addCustomer(req, res) {
  const { full_name, phone, city, type, status, notes } = req.body;

  if (!full_name || !phone) {
    return res.status(400).json({ success: false, message: 'full_name and phone are required.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO customers (full_name, phone, city, type, status, notes, added_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, phone, city || null, type || 'Farmer', status || 'active', notes || null, req.admin.id]
    );

    const [newRow] = await db.query('SELECT * FROM customers WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Customer added successfully!', customer: newRow[0] });

  } catch (err) {
    console.error('addCustomer error:', err);
    res.status(500).json({ success: false, message: 'Could not add customer.' });
  }
}

// PUT /api/customers/:id — admin: update customer
async function updateCustomer(req, res) {
  const { full_name, phone, city, type, status, notes } = req.body;
  const { id } = req.params;

  try {
    await db.query(
      `UPDATE customers SET
         full_name  = COALESCE(?, full_name),
         phone      = COALESCE(?, phone),
         city       = COALESCE(?, city),
         type       = COALESCE(?, type),
         status     = COALESCE(?, status),
         notes      = COALESCE(?, notes)
       WHERE id = ?`,
      [full_name, phone, city, type, status, notes, id]
    );

    const [updated] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Customer updated!', customer: updated[0] });

  } catch (err) {
    console.error('updateCustomer error:', err);
    res.status(500).json({ success: false, message: 'Could not update customer.' });
  }
}

// DELETE /api/customers/:id — admin: delete customer
async function deleteCustomer(req, res) {
  try {
    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Customer not found.' });
    res.json({ success: true, message: 'Customer deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not delete customer.' });
  }
}

module.exports = { getAll, getOne, addCustomer, updateCustomer, deleteCustomer };
