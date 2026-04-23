const db    = require('../config/db');
const audit = require('../utils/audit');

const getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM expenses ORDER BY created_at DESC');
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM expenses WHERE id = ?', [id]);
  if (rows.length === 0) throw new Error('Expense not found.');
  return rows[0];
};

const create = async (data, userId) => {
  const { description, amount, category } = data;
  const [r] = await db.execute(
    'INSERT INTO expenses (description, amount, category) VALUES (?,?,?)',
    [description, amount, category || 'General']
  );
  const expense = await getById(r.insertId);
  await audit(userId, 'CREATE', 'expenses', r.insertId, { description, amount });
  return expense;
};

const update = async (id, data, userId) => {
  await db.execute(
    'UPDATE expenses SET description=?, amount=?, category=? WHERE id=?',
    [data.description, data.amount, data.category || 'General', id]
  );
  const expense = await getById(id);
  await audit(userId, 'UPDATE', 'expenses', id, data);
  return expense;
};

const remove = async (id, userId) => {
  const [r] = await db.execute('DELETE FROM expenses WHERE id = ?', [id]);
  if (r.affectedRows === 0) throw new Error('Expense not found.');
  await audit(userId, 'DELETE', 'expenses', id);
  return { message: 'Expense deleted.' };
};

const getSummary = async () => {
  const [rows] = await db.execute(`
    SELECT category, SUM(amount) AS total, COUNT(*) AS count
    FROM expenses
    GROUP BY category
    ORDER BY total DESC
  `);
  return rows;
};

const getMonthlyTrend = async () => {
  const [rows] = await db.execute(`
    SELECT DATE_FORMAT(created_at,'%Y-%m') AS month, SUM(amount) AS total
    FROM expenses
    GROUP BY DATE_FORMAT(created_at,'%Y-%m')
    ORDER BY month DESC
    LIMIT 12
  `);
  return rows;
};

module.exports = { getAll, getById, create, update, remove, getSummary, getMonthlyTrend };
