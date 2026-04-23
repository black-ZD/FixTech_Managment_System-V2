const db    = require('../config/db');
const audit = require('../utils/audit');

const getAll = async () => {
  const [rows] = await db.execute(`
    SELECT s.*, p.name AS product_name, p.category, u.username AS seller_name
    FROM sales s
    JOIN products p ON s.product_id = p.id
    JOIN users   u ON s.sold_by     = u.id
    ORDER BY s.created_at DESC
  `);
  return rows;
};

/**
 * CRITICAL: Atomic sale — insert sale + update stock + insert stock_history
 */
const create = async ({ product_id, quantity }, userId) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Lock product row
    const [products] = await conn.execute(
      'SELECT id, name, selling_price, purchase_price, quantity FROM products WHERE id = ? AND is_deleted = 0 FOR UPDATE',
      [product_id]
    );
    if (products.length === 0) throw new Error('Product not found.');

    const p = products[0];
    if (p.quantity < quantity)
      throw new Error(`Insufficient stock. Available: ${p.quantity}, requested: ${quantity}.`);

    const total_price = parseFloat((p.selling_price * quantity).toFixed(2));
    const profit      = parseFloat(((p.selling_price - p.purchase_price) * quantity).toFixed(2));
    const newQty      = p.quantity - quantity;

    // 1. Insert sale
    const [saleResult] = await conn.execute(
      'INSERT INTO sales (product_id, quantity, total_price, profit, sold_by) VALUES (?,?,?,?,?)',
      [product_id, quantity, total_price, profit, userId]
    );

    // 2. Update stock
    await conn.execute('UPDATE products SET quantity = ? WHERE id = ?', [newQty, product_id]);

    // 3. Insert stock_history
    await conn.execute(
      `INSERT INTO stock_history (product_id, change_type, quantity_changed, previous_quantity, new_quantity, changed_by)
       VALUES (?,?,?,?,?,?)`,
      [product_id, 'sale', -quantity, p.quantity, newQty, userId]
    );

    await conn.commit();

    await audit(userId, 'SALE', 'sales', saleResult.insertId, { product_id, quantity, total_price, profit });

    return {
      id: saleResult.insertId,
      product_name: p.name,
      quantity,
      total_price,
      profit,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const getDailySales = async () => {
  const [rows] = await db.execute(`
    SELECT DATE(created_at) AS date,
           SUM(total_price) AS revenue,
           SUM(profit)      AS profit,
           COUNT(*)         AS transactions
    FROM sales
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);
  return rows;
};

const getMonthlySales = async () => {
  const [rows] = await db.execute(`
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
           SUM(total_price) AS revenue,
           SUM(profit)      AS profit,
           COUNT(*)         AS transactions
    FROM sales
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month DESC
    LIMIT 12
  `);
  return rows;
};

module.exports = { getAll, create, getDailySales, getMonthlySales };
