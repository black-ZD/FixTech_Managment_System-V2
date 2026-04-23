const db    = require('../config/db');
const audit = require('../utils/audit');

exports.getAll = async () => {
  const [rows] = await db.execute(
    'SELECT * FROM products WHERE is_deleted = 0 ORDER BY created_at DESC'
  );
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM products WHERE id = ? AND is_deleted = 0',
    [id]
  );
  if (rows.length === 0) throw new Error('Product not found.');
  return rows[0];
};

exports.create = async (data, userId) => {
  const { name, category, brand, purchase_price, selling_price, quantity, supplier } = data;
  const [result] = await db.execute(
    'INSERT INTO products (name, category, brand, purchase_price, selling_price, quantity, supplier) VALUES (?,?,?,?,?,?,?)',
    [name, category, brand || null, purchase_price, selling_price, quantity, supplier || null]
  );
  const product = await getById(result.insertId);
  await audit(userId, 'CREATE', 'products', result.insertId, { name, quantity });
  return product;
};

exports.update = async (id, data, userId) => {
  const existing = await getById(id);
  const { name, category, brand, purchase_price, selling_price, quantity, supplier } = data;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      'UPDATE products SET name=?,category=?,brand=?,purchase_price=?,selling_price=?,quantity=?,supplier=? WHERE id=?',
      [name, category, brand || null, purchase_price, selling_price, quantity, supplier || null, id]
    );

    // Record stock change if quantity changed
    if (parseInt(quantity) !== parseInt(existing.quantity)) {
      await conn.execute(
        `INSERT INTO stock_history (product_id, change_type, quantity_changed, previous_quantity, new_quantity, changed_by)
         VALUES (?,?,?,?,?,?)`,
        [id, 'edit', quantity - existing.quantity, existing.quantity, quantity, userId]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  const updated = await getById(id);
  await audit(userId, 'UPDATE', 'products', id, { name, quantity });
  return updated;
};

 exports.softDelete = async (id, userId) => {
  const product = await getById(id);
  await db.execute('UPDATE products SET is_deleted = 1 WHERE id = ?', [id]);

  // Record in stock_history
  await db.execute(
    `INSERT INTO stock_history (product_id, change_type, quantity_changed, previous_quantity, new_quantity, changed_by)
     VALUES (?,?,?,?,?,?)`,
    [id, 'delete', -product.quantity, product.quantity, 0, userId]
  );

  await audit(userId, 'DELETE', 'products', id, { name: product.name });
  return { message: 'Product deleted.' };
};

exports.getLowStock = async (threshold = 5) => {
  const [rows] = await db.execute(
    'SELECT * FROM products WHERE quantity <= ? AND is_deleted = 0 ORDER BY quantity ASC',
    [threshold]
  );
  return rows;
};

 exports.getStockHistory = async (productId) => {
  const q = productId
    ? `SELECT sh.*, p.name AS product_name, u.username AS changed_by_name
       FROM stock_history sh
       JOIN products p ON sh.product_id = p.id
       JOIN users u ON sh.changed_by = u.id
       WHERE sh.product_id = ?
       ORDER BY sh.created_at DESC LIMIT 100`
    : `SELECT sh.*, p.name AS product_name, u.username AS changed_by_name
       FROM stock_history sh
       JOIN products p ON sh.product_id = p.id
       JOIN users u ON sh.changed_by = u.id
       ORDER BY sh.created_at DESC LIMIT 100`;

  const [rows] = productId
    ? await db.execute(q, [productId])
    : await db.execute(q);
  return rows;
};

exports.search = async (q) => {
  const sql = `
    SELECT id, name, category, brand, selling_price, quantity
    FROM products
    WHERE is_deleted = 0
    AND name LIKE ?
    LIMIT 10
  `;

  const [rows] = await db.execute(sql, [`%${q}%`]);
  return rows;
};