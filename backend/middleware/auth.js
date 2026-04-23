const jwt = require('jsonwebtoken');

/**
 * Verify JWT access token attached as  Authorization: Bearer <token>
 */
const authenticate = (req, res, next) => {
  const header = req.headers['authorization'];
  const token  = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token.' });
  }
};

/** Admin-only guard */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  next();
};

module.exports = { authenticate, adminOnly };
