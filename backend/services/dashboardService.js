const db = require('../config/db');

const getStats = async () => {
  const [[products]]  = await db.execute('SELECT COUNT(*) AS count, COALESCE(SUM(quantity),0) AS stock FROM products WHERE is_deleted=0');
  const [[today]]     = await db.execute(`SELECT COALESCE(SUM(total_price),0) AS revenue, COALESCE(SUM(profit),0) AS profit, COUNT(*) AS transactions FROM sales WHERE DATE(created_at)=CURDATE()`);
  const [[monthly]]   = await db.execute(`SELECT COALESCE(SUM(total_price),0) AS revenue, COALESCE(SUM(profit),0) AS profit FROM sales WHERE MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())`);
  const [[totalExp]]  = await db.execute(`SELECT COALESCE(SUM(amount),0) AS total FROM expenses`);
  const [[monthExp]]  = await db.execute(`SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())`);
  const [lowStock]    = await db.execute('SELECT * FROM products WHERE quantity<=5 AND is_deleted=0 ORDER BY quantity ASC LIMIT 10');
  const [bestSelling] = await db.execute(`SELECT p.name,p.category,SUM(s.quantity) AS total_sold,SUM(s.total_price) AS revenue FROM sales s JOIN products p ON s.product_id=p.id GROUP BY s.product_id,p.name,p.category ORDER BY total_sold DESC LIMIT 5`);
  const [[staffCount]]= await db.execute('SELECT COUNT(*) AS count FROM staff');
  const [recentAudit] = await db.execute(`SELECT al.*,u.username FROM audit_logs al LEFT JOIN users u ON al.user_id=u.id ORDER BY al.timestamp DESC LIMIT 10`);

  return {
    totalProducts: products.count,
    totalStock:    products.stock,
    todaySales:    { revenue: +today.revenue, profit: +today.profit, transactions: today.transactions },
    monthlySales:  { revenue: +monthly.revenue, profit: +monthly.profit },
    totalExpenses: +totalExp.total,
    monthlyExpenses: +monthExp.total,
    netProfit:     +monthly.profit - +monthExp.total,
    lowStock,
    bestSelling,
    staffCount:    staffCount.count,
    recentActivity: recentAudit,
  };
};

module.exports = { getStats };
