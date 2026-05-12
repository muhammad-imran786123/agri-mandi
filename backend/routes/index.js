// backend/routes/index.js
const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/auth');

const authCtrl     = require('../controllers/authController');
const ratesCtrl    = require('../controllers/ratesController');
const customersCtrl= require('../controllers/customersController');
const cropsCtrl    = require('../controllers/cropsController');
const contactCtrl  = require('../controllers/contactController');

// ─── AUTH ───────────────────────────────────────────────────
router.post('/auth/login',   authCtrl.login);
router.get ('/auth/me', auth, authCtrl.getMe);

// ─── RATES (public GET, protected POST/DELETE) ───────────────
router.get   ('/rates',              ratesCtrl.getTodayRates);
router.get   ('/rates/history/:cropId', ratesCtrl.getRateHistory);
router.post  ('/rates',       auth,  ratesCtrl.upsertRate);
router.delete('/rates/:id',   auth,  ratesCtrl.deleteRate);

// ─── CUSTOMERS (all protected) ───────────────────────────────
router.get   ('/customers',       auth, customersCtrl.getAll);
router.get   ('/customers/:id',   auth, customersCtrl.getOne);
router.post  ('/customers',       auth, customersCtrl.addCustomer);
router.put   ('/customers/:id',   auth, customersCtrl.updateCustomer);
router.delete('/customers/:id',   auth, customersCtrl.deleteCustomer);

// ─── CROPS (public GET, protected POST/PUT/DELETE) ───────────
router.get   ('/crops',            cropsCtrl.getAll);
router.get   ('/crops/categories', cropsCtrl.getCategories);
router.post  ('/crops',     auth,  cropsCtrl.addCrop);
router.put   ('/crops/:id', auth,  cropsCtrl.updateCrop);
router.delete('/crops/:id', auth,  cropsCtrl.deleteCrop);

// ─── CONTACT ─────────────────────────────────────────────────
router.post ('/contact',          contactCtrl.submitMessage);
router.get  ('/contact',   auth,  contactCtrl.getMessages);
router.patch('/contact/:id/read', auth, contactCtrl.markRead);

module.exports = router;
