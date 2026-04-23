const db    = require('../config/db');
const audit = require('../utils/audit');

const getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM staff ORDER BY name ASC');
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM staff WHERE id = ?', [id]);
  if (rows.length === 0) throw new Error('Staff member not found.');
  return rows[0];
};

const create = async (data, userId) => {
  const { name, role, salary, phone, hire_date } = data;
  const [r] = await db.execute(
    'INSERT INTO staff (name, role, salary, phone, hire_date) VALUES (?,?,?,?,?)',
    [name, role, salary, phone || null, hire_date]
  );
  const member = await getById(r.insertId);
  await audit(userId, 'CREATE', 'staff', r.insertId, { name, role });
  return member;
};

const update = async (id, data, userId) => {
  await db.execute(
    'UPDATE staff SET name=?, role=?, salary=?, phone=?, hire_date=? WHERE id=?',
    [data.name, data.role, data.salary, data.phone || null, data.hire_date, id]
  );
  const member = await getById(id);
  await audit(userId, 'UPDATE', 'staff', id, data);
  return member;
};

const remove = async (id, userId) => {
  const [r] = await db.execute('DELETE FROM staff WHERE id = ?', [id]);
  if (r.affectedRows === 0) throw new Error('Staff member not found.');
  await audit(userId, 'DELETE', 'staff', id);
  return { message: 'Staff member deleted.' };
};

const markAttendance = async (staff_id, date, status, userId) => {
  await db.execute(
    `INSERT INTO attendance (staff_id, date, status) VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE status = ?`,
    [staff_id, date, status, status]
  );
  const [rows] = await db.execute(
    'SELECT * FROM attendance WHERE staff_id = ? AND date = ?',
    [staff_id, date]
  );
  await audit(userId, 'ATTENDANCE', 'attendance', rows[0]?.id, { staff_id, date, status });
  return rows[0];
};

const getAttendance = async (staff_id) => {
  const q = `SELECT a.*, s.name AS staff_name
             FROM attendance a JOIN staff s ON a.staff_id = s.id
             ${staff_id ? 'WHERE a.staff_id = ?' : ''}
             ORDER BY a.date DESC LIMIT 100`;
  const [rows] = staff_id ? await db.execute(q, [staff_id]) : await db.execute(q);
  return rows;
};

module.exports = { getAll, getById, create, update, remove, markAttendance, getAttendance };
