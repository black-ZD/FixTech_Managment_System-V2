// ============================================================
// controllers/authController.js
// ============================================================
const { validationResult } = require('express-validator');
const authService = require('../services/authService');

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const ip   = req.ip || req.connection?.remoteAddress;
    const data = await authService.login(req.body.username, req.body.password, ip);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required.' });
  try {
    const tokens = await authService.refreshTokens(refreshToken);
    res.json({ success: true, ...tokens });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await authService.logout(refreshToken);
  res.json({ success: true, message: 'Logged out.' });
};
