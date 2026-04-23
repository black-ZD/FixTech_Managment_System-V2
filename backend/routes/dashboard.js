// routes/dashboard.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');
const r = express.Router();
r.get('/', authenticate, getStats);
module.exports = r;
