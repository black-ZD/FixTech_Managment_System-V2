const db = require('../config/db');

/** Daily sales report for the last N days (default 30) */
const dailySalesReport = async (days = 30) => {
  const [rows] = await db.execute(`
    SELECT
      DATE(s.created_at) AS date,
      SUM(s.total_price) AS revenue,
      SUM(s.profit)      AS profit,
      COUNT(*)           AS transactions,
      SUM(s.quantity)    AS units_sold
    FROM sales s
    WHERE s.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY DATE(s.created_at)
    ORDER BY date ASC
  `, [days]);
  return rows;
};

/** Monthly profit report */
const monthlyProfitReport = async () => {
  const [salesRows] = await db.execute(`
    SELECT DATE_FORMAT(created_at,'%Y-%m') AS month,
           SUM(total_price) AS revenue,
           SUM(profit)      AS gross_profit
    FROM sales
    GROUP BY DATE_FORMAT(created_at,'%Y-%m')
    ORDER BY month DESC
    LIMIT 12
  `);

  const [expRows] = await db.execute(`
    SELECT DATE_FORMAT(created_at,'%Y-%m') AS month,
           SUM(amount) AS expenses
    FROM expenses
    GROUP BY DATE_FORMAT(created_at,'%Y-%m')
    ORDER BY month DESC
    LIMIT 12
  `);

  // Merge
  const expMap = Object.fromEntries(expRows.map(r => [r.month, +r.expenses]));
  return salesRows.map(r => ({
    month:        r.month,
    revenue:      +r.revenue,
    gross_profit: +r.gross_profit,
    expenses:     expMap[r.month] || 0,
    net_profit:   +r.gross_profit - (expMap[r.month] || 0),
  }));
};

/** Expense breakdown by category */
const expenseBreakdownReport = async () => {
  const [rows] = await db.execute(`
    SELECT category,
           SUM(amount) AS total,
           COUNT(*)    AS count,
           MIN(amount) AS min_amount,
           MAX(amount) AS max_amount,
           AVG(amount) AS avg_amount
    FROM expenses
    GROUP BY category
    ORDER BY total DESC
  `);
  return rows;
};

/** Product performance report */
const productPerformanceReport = async () => {
  const [rows] = await db.execute(`
    SELECT
      p.id,
      p.name,
      p.category,
      p.brand,
      p.quantity AS current_stock,
      p.selling_price,
      p.purchase_price,
      COALESCE(SUM(s.quantity),0)    AS total_units_sold,
      COALESCE(SUM(s.total_price),0) AS total_revenue,
      COALESCE(SUM(s.profit),0)      AS total_profit
    FROM products p
    LEFT JOIN sales s ON p.id = s.product_id
    WHERE p.is_deleted = 0
    GROUP BY p.id, p.name, p.category, p.brand, p.quantity, p.selling_price, p.purchase_price
    ORDER BY total_units_sold DESC
  `);
  return rows;
};

module.exports = {
  dailySalesReport,
  monthlyProfitReport,
  expenseBreakdownReport,
  productPerformanceReport,
};
