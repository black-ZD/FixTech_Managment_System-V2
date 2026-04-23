const db = require('../config/db');

/**
 * Write an entry to audit_logs.
 * Safe — never throws; errors are swallowed to avoid breaking main flows.
 */
const audit = async (userId, action, tableName, recordId = null, details = null) => {
  try {
    await db.execute(
      'INSERT INTO audit_logs (user_id, action, table_name, record_id, details) VALUES (?, ?, ?, ?, ?)',
      [userId || null, action, tableName, recordId || null, details ? JSON.stringify(details) : null]
    );
  } catch (err) {
    console.error('[AUDIT] Failed to write log:', err.message);
  }
};

module.exports = audit;
