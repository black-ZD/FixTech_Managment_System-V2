const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db       = require('../config/db');
const audit    = require('../utils/audit');

const signAccess = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  });

const signRefresh = () => uuidv4(); // opaque random token stored in DB

/**
 * Login — returns access token + refresh token
 */
const login = async (username, password, ipAddress) => {
  const [rows] = await db.execute(
    'SELECT id, username, password, role FROM users WHERE username = ?',
    [username]
  );
  if (rows.length === 0) throw new Error('Invalid username or password.');

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid username or password.');

  // Issue tokens
  const accessPayload = { id: user.id, username: user.username, role: user.role };
  const accessToken   = signAccess(accessPayload);
  const refreshToken  = signRefresh();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await db.execute(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [user.id, refreshToken, expiresAt]
  );

  // Log login activity
  await db.execute(
    'INSERT INTO login_activity (user_id, ip_address) VALUES (?, ?)',
    [user.id, ipAddress || 'unknown']
  );

  await audit(user.id, 'LOGIN', 'users', user.id, { ip: ipAddress });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, role: user.role },
  };
};

/**
 * Rotate refresh token — returns new access + refresh
 */
const refreshTokens = async (oldToken) => {
  const [rows] = await db.execute(
    `SELECT rt.*, u.id as uid, u.username, u.role
     FROM refresh_tokens rt
     JOIN users u ON rt.user_id = u.id
     WHERE rt.token = ? AND rt.expires_at > NOW()`,
    [oldToken]
  );
  if (rows.length === 0) throw new Error('Invalid or expired refresh token.');

  const row = rows[0];
  // Delete old token (rotation)
  await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [oldToken]);

  const newAccess  = signAccess({ id: row.uid, username: row.username, role: row.role });
  const newRefresh = signRefresh();
  const expiresAt  = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.execute(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [row.uid, newRefresh, expiresAt]
  );

  return { accessToken: newAccess, refreshToken: newRefresh };
};

/**
 * Logout — revoke refresh token
 */
const logout = async (refreshToken) => {
  await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
};

module.exports = { login, refreshTokens, logout };
