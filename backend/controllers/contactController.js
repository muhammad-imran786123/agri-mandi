// backend/controllers/contactController.js
const db = require('../config/db');

// POST /api/contact — public: submit contact message
async function submitMessage(req, res) {
  const { full_name, phone, subject, message } = req.body;
  if (!full_name || !message) {
    return res.status(400).json({ success: false, message: 'Name and message are required.' });
  }
  try {
    await db.query(
      'INSERT INTO contact_messages (full_name, phone, subject, message) VALUES (?, ?, ?, ?)',
      [full_name, phone || null, subject || 'General Inquiry', message]
    );
    res.status(201).json({ success: true, message: 'Message sent! We will reply shortly.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not send message.' });
  }
}

// GET /api/contact — admin: get all messages
async function getMessages(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json({ success: true, messages: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch messages.' });
  }
}

// PATCH /api/contact/:id/read — admin: mark as read
async function markRead(req, res) {
  try {
    await db.query('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = { submitMessage, getMessages, markRead };
