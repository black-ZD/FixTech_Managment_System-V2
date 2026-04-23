// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const r = express.Router();

r.post('/login',         authLimiter, [body('username').notEmpty(), body('password').notEmpty()], ctrl.login);
r.post('/refresh-token', authLimiter, ctrl.refresh);
r.post('/logout',        ctrl.logout);

module.exports = r;
